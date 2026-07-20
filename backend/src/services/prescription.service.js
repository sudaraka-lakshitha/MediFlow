import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { prescriptionRepository } from '../repositories/prescription.repository.js';
import { AppError } from '../utils/AppError.js';
import { calculateQuantity } from '../utils/dosage.js';
import { calculateDiscounts } from './discount.service.js';
import { normalizeLiquidDose } from '../utils/liquidDose.js';
import { verifyPickupPin } from '../utils/pickupPin.js';
import { batchAllocationOrder, operationSettingsService } from './operationSettings.service.js';

const serializable = async (operation) => {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await prisma.$transaction(operation, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error.code !== 'P2034' || attempt === 3) throw error;
    }
  }
};
const isLiquidProduct = (product) =>
  ['ml', 'millilitre', 'milliliter', 'l', 'litre', 'liter'].includes(String(product?.unit || '').toLowerCase())
  || /syrup|suspension|solution|elixir|liquid/i.test(String(product?.dosageForm || ''));

const ageOnDate = (dateOfBirth, onDate) => {
  const birth = new Date(dateOfBirth);
  const date = new Date(onDate);
  let age = date.getUTCFullYear() - birth.getUTCFullYear();
  if (date.getUTCMonth() < birth.getUTCMonth() || (date.getUTCMonth() === birth.getUTCMonth() && date.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age;
};

const validatePatientAge = async (patientId, prescriptionDate, products) => {
  const patient = await prisma.patientProfile.findUnique({ where: { id: patientId }, select: { dateOfBirth: true } });
  if (!patient?.dateOfBirth) throw new AppError(400, 'Record the patient date of birth before prescribing medicine so age suitability can be checked.');
  const age = ageOnDate(patient.dateOfBirth, prescriptionDate);
  if (age < 0 || age > 130) throw new AppError(400, 'The patient date of birth is invalid for the prescription date.');
  const unsuitable = products.filter((product) => (product.minimumAgeYears != null && age < product.minimumAgeYears) || (product.maximumAgeYears != null && age > product.maximumAgeYears));
  if (unsuitable.length) throw new AppError(400, `${unsuitable.map((product) => product.genericName).join(', ')} ${unsuitable.length === 1 ? 'is' : 'are'} outside the configured age range for this patient (${age} years). Review the medicine or update its verified age guidance.`);
};

const patientView = (prescription) => ({
  ...prescription, createdBy: undefined, verifiedBy: undefined, verifiedById: undefined,
  paymentRequest: prescription.paymentRequest ? { ...prescription.paymentRequest, pickupPinHash: undefined, pickupPinEncrypted: undefined, pinAttempts: undefined } : null,
  dispensings: prescription.dispensings?.map((issue) => ({ ...issue, pharmacist: { id: issue.pharmacist.id, fullName: issue.pharmacist.fullName } })),
});

export const prescriptionService = {
  async list(user) {
    if (user.role !== 'PATIENT') return prescriptionRepository.list();
    const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    return profile ? (await prescriptionRepository.list({ patientId: profile.id })).map(patientView) : [];
  },
  async get(id, user) {
    const data = await prescriptionRepository.findById(id);
    if (!data) return null;
    if (user.role === 'PATIENT' && data.patient.user.id !== user.id) throw new AppError(403, 'This prescription does not belong to you.');
    return user.role === 'PATIENT' ? patientView(data) : data;
  },
  async create(data, userId) {
    if (data.sourceUploadId) {
      const [upload, profile] = await Promise.all([
        prisma.prescriptionUpload.findUnique({ where: { id: data.sourceUploadId }, select: { patientId: true, prescription: { select: { id: true } } } }),
        prisma.patientProfile.findUnique({ where: { id: data.patientId }, select: { userId: true } }),
      ]);
      if (!upload || upload.prescription || !profile || upload.patientId !== profile.userId) throw new AppError(400, 'The uploaded prescription does not belong to the selected patient or is already linked.');
    }
    const [products, retailProducts] = await Promise.all([
      prisma.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) }, active: true, productType: 'MEDICINE' }, select: { id: true, unit: true, genericName: true, minimumAgeYears: true, maximumAgeYears: true } }),
      prisma.product.findMany({ where: { id: { in: data.retailItems.map((item) => item.productId) }, active: true, prescriptionRequired: false }, select: { id: true } }),
    ]);
    if (products.length !== new Set(data.items.map((item) => item.productId)).size) throw new AppError(400, 'One or more selected products are unavailable.');
    if (retailProducts.length !== new Set(data.retailItems.map((item) => item.productId)).size) throw new AppError(400, 'One or more selected retail items are unavailable or require a prescription.');
    await validatePatientAge(data.patientId, data.prescriptionDate, products);
    const items = data.items.map((rawItem) => {
      const item = normalizeLiquidDose(rawItem);
      const product = products.find((candidate) => candidate.id === item.productId);
      const { calculated, prescribed, overridden } = calculateQuantity(product.unit, item);
      return { productId: item.productId, quantityPerDose: item.quantityPerDose, doseInputAmount: item.doseInputAmount, doseInputUnit: item.doseInputUnit,
        concentrationAmount: item.concentrationAmount, concentrationUnit: item.concentrationUnit, concentrationVolume: item.concentrationVolume, timesPerDay: item.timesPerDay,
        daysSupply: item.daysSupply, calculatedQuantity: calculated, prescribedQuantity: prescribed,
        quantityOverridden: overridden, overrideReason: overridden ? item.overrideReason : null,
        dosageInstructions: item.dosageInstructions, frequency: item.frequency, duration: item.duration, notes: item.notes,
        administrationRoute: item.administrationRoute, mealTiming: item.mealTiming, asNeeded: item.asNeeded, specialInstructions: item.specialInstructions };
    });
    return prisma.$transaction(async (tx) => {
      const prescription = await tx.prescription.create({ data: {
        prescriptionNumber: `RX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
        patientId: data.patientId, sourceUploadId: data.sourceUploadId || null, prescriberTitle: data.prescriberTitle || null,
        prescriberName: data.prescriberName, prescriberReference: data.prescriberReference,
        prescriptionDate: data.prescriptionDate, orderedForSelf:data.orderedForSelf, recipientName:data.orderedForSelf?null:data.recipientName,
        recipientRelationship:data.orderedForSelf?null:data.recipientRelationship, notes: data.notes,
        pickupNote: data.pickupNote || null, plannedPickupAt: data.plannedPickupAt || null,
        createdById: userId,
        items: { create: items },
        retailItems: { create: data.retailItems.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      } });
      return tx.prescription.findUnique({ where: { id: prescription.id }, include: { items: { include: { product: true } }, retailItems: { include: { product: true } }, patient: { include: { user: true } } } });
    });
  },
  async update(id, data) {
    const current = await prisma.prescription.findUnique({ where: { id }, select: { status:true } });
    if (!current) throw new AppError(404, 'Prescription not found.');
    if (current.status !== 'PENDING') throw new AppError(409, 'Only pending prescriptions can be edited.');
    const [products, retailProducts] = await Promise.all([
      prisma.product.findMany({ where: { id: { in:data.items.map((item)=>item.productId) }, active:true, productType:'MEDICINE' }, select:{ id:true,unit:true,genericName:true,minimumAgeYears:true,maximumAgeYears:true } }),
      prisma.product.findMany({ where: { id: { in:data.retailItems.map((item)=>item.productId) }, active:true, prescriptionRequired:false }, select:{ id:true } }),
    ]);
    if(retailProducts.length!==new Set(data.retailItems.map((item)=>item.productId)).size)throw new AppError(400,'One or more selected retail items are unavailable or require a prescription.');
    await validatePatientAge(data.patientId, data.prescriptionDate, products);
    const items=data.items.map((rawItem)=>{const item=normalizeLiquidDose(rawItem);const product=products.find((candidate)=>candidate.id===item.productId);if(!product)throw new AppError(400,'One or more selected products are unavailable.');const{calculated,prescribed,overridden}=calculateQuantity(product.unit,item);return{productId:item.productId,quantityPerDose:item.quantityPerDose,doseInputAmount:item.doseInputAmount,doseInputUnit:item.doseInputUnit,concentrationAmount:item.concentrationAmount,concentrationUnit:item.concentrationUnit,concentrationVolume:item.concentrationVolume,timesPerDay:item.timesPerDay,daysSupply:item.daysSupply,calculatedQuantity:calculated,prescribedQuantity:prescribed,quantityOverridden:overridden,overrideReason:overridden?item.overrideReason:null,dosageInstructions:item.dosageInstructions,frequency:item.frequency,duration:item.duration,notes:item.notes,administrationRoute:item.administrationRoute,mealTiming:item.mealTiming,asNeeded:item.asNeeded,specialInstructions:item.specialInstructions}});
    return prisma.$transaction(async(tx)=>{await tx.prescriptionItem.deleteMany({where:{prescriptionId:id}});await tx.prescriptionRetailItem.deleteMany({where:{prescriptionId:id}});await tx.prescription.update({where:{id},data:{patientId:data.patientId,prescriberTitle:data.prescriberTitle||null,prescriberName:data.prescriberName,prescriberReference:data.prescriberReference,prescriptionDate:data.prescriptionDate,orderedForSelf:data.orderedForSelf,recipientName:data.orderedForSelf?null:data.recipientName,recipientRelationship:data.orderedForSelf?null:data.recipientRelationship,notes:data.notes,pickupNote:data.pickupNote||null,plannedPickupAt:data.plannedPickupAt||null,items:{create:items},retailItems:{create:data.retailItems.map((item)=>({productId:item.productId,quantity:item.quantity}))}}});return tx.prescription.findUnique({where:{id},include:{items:{include:{product:true}},retailItems:{include:{product:true}},patient:{include:{user:true}}}})});
  },
  async updatePickupDetails(id, data, user) {
    const current = await prisma.prescription.findUnique({
      where: { id },
      include: { patient: true }
    });
    if (!current) throw new AppError(404, 'Prescription not found.');
    if (user.role === 'PATIENT' && current.patient.userId !== user.id) {
      throw new AppError(403, 'This prescription does not belong to you.');
    }
    if (['DISPENSED', 'REJECTED'].includes(current.status)) {
      throw new AppError(409, 'Cannot update collection details for dispensed or rejected prescriptions.');
    }
    return prisma.prescription.update({
      where: { id },
      data: {
        pickupNote: data.pickupNote || null,
        plannedPickupAt: data.plannedPickupAt ? new Date(data.plannedPickupAt) : null,
      },
      include: {
        patient: { include: { user: { select: { id: true, fullName: true } } } },
        items: { include: { product: true } },
        retailItems: { include: { product: true } },
        createdBy: { select: { id: true, fullName: true, role: true } },
        verifiedBy: { select: { id: true, fullName: true, role: true } },
        dispensings: { include: { sale: true, pharmacist: { select: { id:true, fullName:true, email:true, role:true } }, items:{ include:{ prescriptionItem:{ include:{ product:true } } } } }, orderBy: { dispensedAt: 'desc' } },
        sourceUpload: { select: { id: true, originalName: true, mimeType: true, status: true } },
        paymentRequest: { include: { cashier: { select: { id: true, fullName: true } }, items: { include: { product: true } }, sale: { select: { id: true, invoiceNumber: true } } } },
      }
    });
  },
  async remove(id) {
    const removed = await prisma.prescription.deleteMany({ where: { id, status: 'PENDING' } });
    if (removed.count !== 1) throw new AppError(409, 'This prescription is already being processed or is no longer pending.');
    return { id };
  },
  async verify(id, userId) {
    const verified = await prisma.prescription.updateMany({ where: { id, status: 'PENDING' }, data: { status: 'VERIFIED', verifiedById: userId, verifiedAt: new Date() } });
    if (verified.count !== 1) throw new AppError(409, 'This prescription was just processed by another staff member. Refresh to see its latest status.');
    return prisma.prescription.findUnique({ where: { id } });
  },
  async reject(id, reason) {
    const rejected = await prisma.prescription.updateMany({ where: { id, status: { in: ['PENDING', 'VERIFIED'] } }, data: { status: 'REJECTED', rejectionReason: reason } });
    if (rejected.count !== 1) throw new AppError(409, 'This prescription was just processed by another staff member. Refresh to see its latest status.');
    return prisma.prescription.findUnique({ where: { id } });
  },

  async quoteDispensing(prescriptionId, input) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { items: { include: { product: true } } },
    });
    if (!prescription) throw new AppError(404, 'Prescription not found.');
    if (!['VERIFIED', 'PARTIALLY_DISPENSED'].includes(prescription.status)) throw new AppError(409, 'Only verified prescriptions can be quoted for dispensing.');

    const allocations = []; const lines = []; let subtotal = new Prisma.Decimal(0); const now = new Date();
    for (const requested of input.items) {
      const item = prescription.items.find((candidate) => candidate.id === requested.prescriptionItemId);
      if (!item) throw new AppError(404, `Prescription item ${requested.prescriptionItemId} was not found.`);
      const quantity = new Prisma.Decimal(requested.quantity); const remaining = item.prescribedQuantity.sub(item.dispensedQuantity);
      if (quantity.greaterThan(remaining)) throw new AppError(409, `${item.product.genericName}: quantity exceeds the prescribed remainder.`);
      const stock = await prisma.inventoryBatch.aggregate({ where: { productId: item.productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, _sum: { quantityAvailable: true } });
      const available = stock._sum.quantityAvailable || new Prisma.Decimal(0);
      if (available.lessThan(quantity)) throw new AppError(409, `Insufficient usable stock for ${item.product.genericName}.`);
      const lineTotal = item.product.sellingPrice.mul(quantity).toDecimalPlaces(2); subtotal = subtotal.add(lineTotal);
      allocations.push({ productId: item.productId, categoryId: item.product.categoryId, quantity, unitPrice: item.product.sellingPrice, lineTotal });
      lines.push({ source: 'PRESCRIPTION', prescriptionItemId: item.id, productId: item.productId, name: `${item.product.genericName} ${item.product.strength}`, unit: item.product.unit, quantity, unitPrice: item.product.sellingPrice, lineTotal });
    }

    const retailRequests = input.retailItems || [];
    const retailProductIds = [...new Set(retailRequests.map((item) => item.productId))];
    const retailProducts = retailProductIds.length ? await prisma.product.findMany({
      where: { id: { in: retailProductIds }, active: true, prescriptionRequired: false },
      include: {
        category: true,
        batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, select: { quantityAvailable: true } },
      },
    }) : [];
    if (retailProducts.length !== retailProductIds.length) throw new AppError(400, 'One or more retail items are unavailable or require a prescription.');
    const retailById = new Map(retailProducts.map((product) => [product.id, product]));
    for (const requested of retailRequests) {
      const product = retailById.get(requested.productId);
      const quantity = new Prisma.Decimal(requested.quantity);
      const available = product.batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
      if (available.lessThan(quantity)) throw new AppError(409, `Insufficient usable stock for ${product.genericName}.`);
      const lineTotal = product.sellingPrice.mul(quantity).toDecimalPlaces(2);
      subtotal = subtotal.add(lineTotal);
      allocations.push({ productId: product.id, categoryId: product.categoryId, quantity, unitPrice: product.sellingPrice, lineTotal });
      lines.push({
        source: 'RETAIL', prescriptionItemId: null, productId: product.id,
        name: `${product.genericName}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`,
        unit: product.unit, quantity, unitPrice: product.sellingPrice, lineTotal,
      });
    }
    subtotal = subtotal.toDecimalPlaces(2);
    const discountResult = await calculateDiscounts(prisma, allocations, subtotal, input.couponCode);
    const selectedProducts = [
      ...input.items.map((requested) => prescription.items.find((item) => item.id === requested.prescriptionItemId)?.product).filter(Boolean),
      ...retailProducts,
    ];
    const hasLiquidMedicine = selectedProducts.some(isLiquidProduct);
    const containerFee = new Prisma.Decimal(input.containerFee || 0).toDecimalPlaces(2);
    if (containerFee.greaterThan(0) && !hasLiquidMedicine) throw new AppError(400, 'Bottle or container fees can be added only when issuing a liquid medicine.');
    const tax = new Prisma.Decimal(input.tax).toDecimalPlaces(2); const total = Prisma.Decimal.max(0, subtotal.sub(discountResult.amount).add(containerFee).add(tax)).toDecimalPlaces(2);
    const amountPaid = new Prisma.Decimal(input.amountPaid).toDecimalPlaces(2);
    return { lines, subtotal, discount: discountResult.amount, appliedDiscounts: discountResult.applications, containerFee, tax, total, amountPaid,
      balanceDue: Prisma.Decimal.max(0, total.sub(amountPaid)).toDecimalPlaces(2), changeDue: Prisma.Decimal.max(0, amountPaid.sub(total)).toDecimalPlaces(2),
      paymentStatus: amountPaid.greaterThanOrEqualTo(total) ? 'PAID' : 'PENDING' };
  },

  async dispense(prescriptionId, input, pharmacistId) {
    if (!input.paymentRequestId || !input.pickupPin) throw new AppError(402, 'Every prescription must be paid at the cashier and verified with the receipt PIN before dispensing.');
    const paidRequest = await prisma.paymentRequest.findFirst({ where: { id: input.paymentRequestId, prescriptionId }, include: { items: { include: { product: true } } } });
    if (!paidRequest || paidRequest.status !== 'PAID') throw new AppError(402, 'Cashier payment has not been completed for this prescription.');
    if (paidRequest.pinAttempts >= 5) throw new AppError(423, 'The receipt PIN is locked after too many failed attempts. Ask an administrator for assistance.');
    if (!verifyPickupPin(paidRequest.id, input.pickupPin, paidRequest.pickupPinHash)) {
      await prisma.paymentRequest.update({ where: { id: paidRequest.id }, data: { pinAttempts: { increment: 1 } } });
      throw new AppError(400, 'The receipt PIN is incorrect.');
    }
    const paidPrescriptionItems = paidRequest.items.filter((item) => item.prescriptionItemId != null);
    const paidItems = new Map(paidPrescriptionItems.map((item) => [item.prescriptionItemId, Number(item.quantity)]));
    if (paidPrescriptionItems.length !== input.items.length || input.items.some((item) => Number(item.quantity) !== Number(paidItems.get(item.prescriptionItemId)))) {
      throw new AppError(409, 'Dispensing quantities must exactly match the paid cashier request.');
    }
    return serializable(async (tx) => {
      const prescription = await tx.prescription.findUnique({
        where: { id: prescriptionId },
        include: { patient: { include: { user: true } }, items: { include: { product: true } } },
      });
      if (!prescription) throw new AppError(404, 'Prescription not found.');
      if (!['VERIFIED', 'PARTIALLY_DISPENSED'].includes(prescription.status)) {
        throw new AppError(409, 'Only verified prescriptions can be dispensed.');
      }
      if (paidRequest) {
        const claimed = await tx.paymentRequest.updateMany({ where: { id: paidRequest.id, status: 'PAID' }, data: { status: 'FULFILLED', pinVerifiedAt: new Date() } });
        if (claimed.count !== 1) throw new AppError(409, 'This prescription bill is already being processed or has been completed by another staff member.');
      }

      const dispensing = await tx.dispensing.create({ data: { prescriptionId, pharmacistId, notes: input.notes } });
      const allocations = [];
      let subtotal = new Prisma.Decimal(0);
      const now = new Date();
      const operationSettings = await operationSettingsService.get(tx);
      const allocationOrder = batchAllocationOrder(operationSettings.allocationMethod);

      for (const requested of input.items) {
        const item = prescription.items.find((candidate) => candidate.id === requested.prescriptionItemId);
        if (!item) throw new AppError(404, `Prescription item ${requested.prescriptionItemId} was not found.`);
        const requestedQuantity = new Prisma.Decimal(requested.quantity);
        const remaining = item.prescribedQuantity.sub(item.dispensedQuantity);
        if (requestedQuantity.greaterThan(remaining)) throw new AppError(409, `${item.product.genericName}: quantity exceeds the prescribed remainder.`);

        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: item.productId } });
        const batches = await tx.inventoryBatch.findMany({
          where: { productId: item.productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false },
          orderBy: allocationOrder,
        });
        const available = batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
        if (available.lessThan(requestedQuantity)) throw new AppError(409, `Insufficient usable stock for ${item.product.genericName}.`);

        let left = requestedQuantity;
        for (const batch of batches) {
          if (left.isZero()) break;
          const quantity = Prisma.Decimal.min(left, batch.quantityAvailable);
          const after = batch.quantityAvailable.sub(quantity);
          await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: after } });
          await tx.stockMovement.create({ data: {
            productId: item.productId, batchId: batch.id, type: 'DISPENSING', quantityChange: -quantity,
            quantityBefore: batch.quantityAvailable, quantityAfter: after, referenceType: 'DISPENSING',
            referenceId: dispensing.id, reason: 'Prescription dispensing', performedById: pharmacistId,
          } });
          await tx.dispensingItem.create({ data: {
            dispensingId: dispensing.id, prescriptionItemId: item.id, batchId: batch.id,
            quantity, unitPrice: paidRequest?.items.find((paidItem) => paidItem.prescriptionItemId === item.id)?.unitPrice || item.product.sellingPrice,
          } });
          const unitPrice = paidRequest?.items.find((paidItem) => paidItem.prescriptionItemId === item.id)?.unitPrice || item.product.sellingPrice;
          const lineTotal = unitPrice.mul(quantity);
          subtotal = subtotal.add(lineTotal);
          allocations.push({ productId: item.productId, categoryId: item.product.categoryId, batchId: batch.id, quantity, unitPrice, lineTotal });
          left = left.sub(quantity);
        }
        await tx.prescriptionItem.update({ where: { id: item.id }, data: { dispensedQuantity: { increment: requestedQuantity } } });
      }

      const paidRetailItems = paidRequest.items.filter((item) => item.prescriptionItemId == null);
      for (const requested of paidRetailItems) {
        const requestedQuantity = new Prisma.Decimal(requested.quantity);
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: requested.productId } });
        const batches = await tx.inventoryBatch.findMany({
          where: { productId: requested.productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false },
          orderBy: allocationOrder,
        });
        const available = batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
        if (available.lessThan(requestedQuantity)) throw new AppError(409, `Insufficient usable stock for ${requested.product.genericName}.`);

        let left = requestedQuantity;
        for (const batch of batches) {
          if (left.isZero()) break;
          const quantity = Prisma.Decimal.min(left, batch.quantityAvailable);
          const after = batch.quantityAvailable.sub(quantity);
          const lineTotal = requested.unitPrice.mul(quantity);
          await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: after } });
          await tx.stockMovement.create({ data: {
            productId: requested.productId, batchId: batch.id, type: 'RETAIL_SALE', quantityChange: quantity.negated(),
            quantityBefore: batch.quantityAvailable, quantityAfter: after, referenceType: 'PAYMENT_REQUEST',
            referenceId: paidRequest.id, reason: 'Retail item on prescription invoice', performedById: pharmacistId,
          } });
          subtotal = subtotal.add(lineTotal);
          allocations.push({
            productId: requested.productId, categoryId: requested.product.categoryId, batchId: batch.id,
            quantity, unitPrice: requested.unitPrice, lineTotal,
          });
          left = left.sub(quantity);
        }
      }

      const discountResult = paidRequest ? { amount: paidRequest.discount, applications: [] } : await calculateDiscounts(tx, allocations, subtotal, input.couponCode);
      const discount = discountResult.amount;
      const containerFee = paidRequest ? paidRequest.containerFee : new Prisma.Decimal(input.containerFee || 0);
      const tax = paidRequest ? paidRequest.tax : new Prisma.Decimal(input.tax);
      const total = paidRequest ? paidRequest.total : Prisma.Decimal.max(0, subtotal.sub(discount).add(containerFee).add(tax));
      const amountPaid = paidRequest ? paidRequest.amountPaid : new Prisma.Decimal(input.amountPaid);
      const saleSubtotal = paidRequest ? paidRequest.subtotal : subtotal;
      const sale = await tx.sale.create({ data: {
        invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        dispensingId: dispensing.id, patientId: prescription.patient.userId, pharmacistId,
        cashierId: paidRequest?.cashierId || null, paymentRequestId: paidRequest?.id || null,
        subtotal: saleSubtotal, discount, containerFee, tax, total, amountPaid, paymentMethod: paidRequest?.paymentMethod || input.paymentMethod,
        status: amountPaid.greaterThanOrEqualTo(total) ? 'PAID' : 'PENDING', items: { create: allocations.map(({ categoryId, ...item }) => item) },
        discountApplications: { create: discountResult.applications },
      } });

      const currentItems = await tx.prescriptionItem.findMany({ where: { prescriptionId }, select: { prescribedQuantity: true, dispensedQuantity: true } });
      const status = currentItems.every((item) => item.dispensedQuantity.greaterThanOrEqualTo(item.prescribedQuantity)) ? 'DISPENSED' : 'PARTIALLY_DISPENSED';
      await tx.prescription.update({ where: { id: prescriptionId }, data: { status } });
      return {
        dispensingId: dispensing.id, saleId: sale.id, invoiceNumber: sale.invoiceNumber,
        subtotal: saleSubtotal, discount, appliedDiscounts: discountResult.applications, total, amountPaid,
        retailItemCount: paidRetailItems.length, paymentStatus: sale.status, prescriptionStatus: status,
      };
    });
  },
};
