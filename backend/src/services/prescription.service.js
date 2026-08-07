import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { prescriptionRepository } from '../repositories/prescription.repository.js';
import { AppError } from '../utils/AppError.js';
import { calculateQuantity } from '../utils/dosage.js';
import { assertCouponMatched, calculateDiscounts } from './discount.service.js';
import { normalizeLiquidDose } from '../utils/liquidDose.js';
import { verifyPickupPin } from '../utils/pickupPin.js';
import { batchAllocationOrder, operationSettingsService } from './operationSettings.service.js';
import { ageOnDate } from '../utils/age.js';
import { findAgeUnsuitable } from '../utils/ageSuitability.js';
import { withUniqueRetry } from '../utils/withUniqueRetry.js';
import { serializable } from '../utils/serializable.js';
import { consumePaymentRequestStock, usableStockTotal } from '../utils/stock.js';
const isLiquidProduct = (product) =>
  ['ml', 'millilitre', 'milliliter', 'l', 'litre', 'liter'].includes(String(product?.unit || '').toLowerCase())
  || /syrup|suspension|solution|elixir|liquid/i.test(String(product?.dosageForm || ''));

const validatePatientAge = async (data, products) => {
  let dateOfBirth = data.recipientDateOfBirth;
  if (data.orderedForSelf) {
    const patient = await prisma.patientProfile.findUnique({ where: { id: data.patientId }, select: { dateOfBirth: true } });
    dateOfBirth = patient?.dateOfBirth;
  }
  if (!dateOfBirth) {
    throw new AppError(400, data.orderedForSelf
      ? 'Record the patient date of birth before prescribing medicine so age suitability can be checked.'
      : 'Record the recipient date of birth so medicine age suitability can be checked.');
  }
  const age = ageOnDate(dateOfBirth, data.prescriptionDate);
  if (age < 0 || age > 130) throw new AppError(400, 'The medicine recipient date of birth is invalid for the prescription date.');
  const unsuitable = findAgeUnsuitable(products, age);
  if (unsuitable.length) throw new AppError(400, `${unsuitable.map((product) => product.genericName).join(', ')} ${unsuitable.length === 1 ? 'is' : 'are'} outside the configured age range for this medicine recipient (${age} years). Review the medicine or update its verified age guidance.`);
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
    await validatePatientAge(data, products);
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
      const prescription = await withUniqueRetry(() => tx.prescription.create({ data: {
        prescriptionNumber: `RX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
        patientId: data.patientId, sourceUploadId: data.sourceUploadId || null, prescriberTitle: data.prescriberTitle || null,
        prescriberName: data.prescriberName, prescriberReference: data.prescriberReference,
        prescriptionDate: data.prescriptionDate, orderedForSelf:data.orderedForSelf, recipientName:data.orderedForSelf?null:data.recipientName,
        recipientRelationship:data.orderedForSelf?null:data.recipientRelationship,
        recipientDateOfBirth:data.orderedForSelf?null:data.recipientDateOfBirth, notes: data.notes,
        pickupNote: data.pickupNote || null, plannedPickupAt: data.plannedPickupAt || null,
        createdById: userId,
        items: { create: items },
        retailItems: { create: data.retailItems.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      } }));
      return tx.prescription.findUnique({ where: { id: prescription.id }, include: { items: { include: { product: true } }, retailItems: { include: { product: true } }, patient: { include: { user: true } } } });
    });
  },
  async update(id, data) {
    const current = await prisma.prescription.findUnique({ where: { id }, select: { status: true, paymentRequest: { select: { status: true } } } });
    if (!current) throw new AppError(404, 'Prescription not found.');
    if (!['PENDING', 'VERIFIED'].includes(current.status)) throw new AppError(409, 'Only pending or verified prescriptions can be edited.');
    if (current.status === 'VERIFIED' && current.paymentRequest && current.paymentRequest.status !== 'CANCELLED') {
      throw new AppError(409, 'This prescription already has an active cashier bill. Cancel the bill before editing the prescription.');
    }
    const revertToPending = current.status === 'VERIFIED';
    const [products, retailProducts] = await Promise.all([
      prisma.product.findMany({ where: { id: { in:data.items.map((item)=>item.productId) }, active:true, productType:'MEDICINE' }, select:{ id:true,unit:true,genericName:true,minimumAgeYears:true,maximumAgeYears:true } }),
      prisma.product.findMany({ where: { id: { in:data.retailItems.map((item)=>item.productId) }, active:true, prescriptionRequired:false }, select:{ id:true } }),
    ]);
    if(retailProducts.length!==new Set(data.retailItems.map((item)=>item.productId)).size)throw new AppError(400,'One or more selected retail items are unavailable or require a prescription.');
    await validatePatientAge(data, products);
    const items=data.items.map((rawItem)=>{const item=normalizeLiquidDose(rawItem);const product=products.find((candidate)=>candidate.id===item.productId);if(!product)throw new AppError(400,'One or more selected products are unavailable.');const{calculated,prescribed,overridden}=calculateQuantity(product.unit,item);return{productId:item.productId,quantityPerDose:item.quantityPerDose,doseInputAmount:item.doseInputAmount,doseInputUnit:item.doseInputUnit,concentrationAmount:item.concentrationAmount,concentrationUnit:item.concentrationUnit,concentrationVolume:item.concentrationVolume,timesPerDay:item.timesPerDay,daysSupply:item.daysSupply,calculatedQuantity:calculated,prescribedQuantity:prescribed,quantityOverridden:overridden,overrideReason:overridden?item.overrideReason:null,dosageInstructions:item.dosageInstructions,frequency:item.frequency,duration:item.duration,notes:item.notes,administrationRoute:item.administrationRoute,mealTiming:item.mealTiming,asNeeded:item.asNeeded,specialInstructions:item.specialInstructions}});
    return prisma.$transaction(async(tx)=>{await tx.prescriptionItem.deleteMany({where:{prescriptionId:id}});await tx.prescriptionRetailItem.deleteMany({where:{prescriptionId:id}});await tx.prescription.update({where:{id},data:{patientId:data.patientId,prescriberTitle:data.prescriberTitle||null,prescriberName:data.prescriberName,prescriberReference:data.prescriberReference,prescriptionDate:data.prescriptionDate,orderedForSelf:data.orderedForSelf,recipientName:data.orderedForSelf?null:data.recipientName,recipientRelationship:data.orderedForSelf?null:data.recipientRelationship,recipientDateOfBirth:data.orderedForSelf?null:data.recipientDateOfBirth,notes:data.notes,pickupNote:data.pickupNote||null,plannedPickupAt:data.plannedPickupAt||null,status:revertToPending?'PENDING':undefined,verifiedById:revertToPending?null:undefined,verifiedAt:revertToPending?null:undefined,items:{create:items},retailItems:{create:data.retailItems.map((item)=>({productId:item.productId,quantity:item.quantity}))}}});return tx.prescription.findUnique({where:{id},include:{items:{include:{product:true}},retailItems:{include:{product:true}},patient:{include:{user:true}}}})});
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
      include: { items: { include: { product: true } }, paymentRequest: { select: { id: true, status: true } } },
    });
    if (!prescription) throw new AppError(404, 'Prescription not found.');
    if (!['VERIFIED', 'PARTIALLY_DISPENSED'].includes(prescription.status)) throw new AppError(409, 'Only verified prescriptions can be quoted for dispensing.');

    // A PAID bill already holds a reservation against these exact units. Re-quoting it (e.g. the
    // live preview while the dispense modal is open) must not count that hold against itself, or a
    // bill that reserved the last remaining stock would falsely report itself as insufficient.
    const ownPaymentRequestId = prescription.paymentRequest?.status === 'PAID' ? prescription.paymentRequest.id : null;
    const ownReservations = ownPaymentRequestId
      ? await prisma.stockReservation.findMany({ where: { paymentRequestId: ownPaymentRequestId }, select: { batchId: true, quantity: true, batch: { select: { productId: true } } } })
      : [];
    const ownReservedByProduct = new Map();
    const ownReservedByBatch = new Map();
    for (const reservation of ownReservations) {
      ownReservedByProduct.set(reservation.batch.productId, (ownReservedByProduct.get(reservation.batch.productId) || new Prisma.Decimal(0)).add(reservation.quantity));
      ownReservedByBatch.set(reservation.batchId, (ownReservedByBatch.get(reservation.batchId) || new Prisma.Decimal(0)).add(reservation.quantity));
    }

    const allocations = []; const lines = []; let subtotal = new Prisma.Decimal(0); const now = new Date();
    for (const requested of input.items) {
      const item = prescription.items.find((candidate) => candidate.id === requested.prescriptionItemId);
      if (!item) throw new AppError(404, `Prescription item ${requested.prescriptionItemId} was not found.`);
      const quantity = new Prisma.Decimal(requested.quantity); const remaining = item.prescribedQuantity.sub(item.dispensedQuantity);
      if (quantity.greaterThan(remaining)) throw new AppError(409, `${item.product.genericName}: quantity exceeds the prescribed remainder.`);
      const stock = await prisma.inventoryBatch.aggregate({ where: { productId: item.productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, _sum: { quantityAvailable: true, quantityReserved: true } });
      const reservedByOthers = (stock._sum.quantityReserved || new Prisma.Decimal(0)).sub(ownReservedByProduct.get(item.productId) || 0);
      const available = (stock._sum.quantityAvailable || new Prisma.Decimal(0)).sub(reservedByOthers);
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
        batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, select: { id: true, quantityAvailable: true, quantityReserved: true } },
      },
    }) : [];
    if (retailProducts.length !== retailProductIds.length) throw new AppError(400, 'One or more retail items are unavailable or require a prescription.');
    const retailById = new Map(retailProducts.map((product) => [product.id, product]));
    for (const requested of retailRequests) {
      const product = retailById.get(requested.productId);
      const quantity = new Prisma.Decimal(requested.quantity);
      const adjustedBatches = product.batches.map((batch) => ({ ...batch, quantityReserved: batch.quantityReserved.sub(ownReservedByBatch.get(batch.id) || 0) }));
      const available = usableStockTotal(adjustedBatches);
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
    const discountResult = assertCouponMatched(await calculateDiscounts(prisma, allocations, subtotal, input.couponCode));
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
      const claimed = await tx.paymentRequest.updateMany({ where: { id: paidRequest.id, status: 'PAID' }, data: { status: 'FULFILLED', pinVerifiedAt: new Date() } });
      if (claimed.count !== 1) throw new AppError(409, 'This prescription bill is already being processed or has been completed by another staff member.');

      for (const requested of input.items) {
        const item = prescription.items.find((candidate) => candidate.id === requested.prescriptionItemId);
        if (!item) throw new AppError(404, `Prescription item ${requested.prescriptionItemId} was not found.`);
        const requestedQuantity = new Prisma.Decimal(requested.quantity);
        const remaining = item.prescribedQuantity.sub(item.dispensedQuantity);
        if (requestedQuantity.greaterThan(remaining)) throw new AppError(409, `${item.product.genericName}: quantity exceeds the prescribed remainder.`);
      }

      const dispensing = await tx.dispensing.create({ data: { prescriptionId, pharmacistId, notes: input.notes } });
      const operationSettings = await operationSettingsService.get(tx);
      const allocationOrder = batchAllocationOrder(operationSettings.allocationMethod);
      const itemById = new Map(paidRequest.items.map((item) => [item.id, item]));
      const consumed = await consumePaymentRequestStock(tx, paidRequest, allocationOrder);
      const allocations = [];
      const dispensedQuantities = new Map();

      for (const entry of consumed) {
        const paidItem = itemById.get(entry.paymentRequestItemId);
        const isPrescriptionItem = paidItem.prescriptionItemId != null;
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: entry.productId } });
        const lineTotal = paidItem.unitPrice.mul(entry.quantity);
        await tx.stockMovement.create({ data: {
          productId: entry.productId, batchId: entry.batchId,
          type: isPrescriptionItem ? 'DISPENSING' : 'RETAIL_SALE',
          quantityChange: entry.quantity.negated(), quantityBefore: entry.quantityBefore, quantityAfter: entry.quantityAfter,
          referenceType: isPrescriptionItem ? 'DISPENSING' : 'PAYMENT_REQUEST',
          referenceId: isPrescriptionItem ? dispensing.id : paidRequest.id,
          reason: isPrescriptionItem ? 'Prescription dispensing' : 'Retail item on prescription invoice',
          performedById: pharmacistId,
        } });
        if (isPrescriptionItem) {
          await tx.dispensingItem.create({ data: {
            dispensingId: dispensing.id, prescriptionItemId: paidItem.prescriptionItemId, batchId: entry.batchId,
            quantity: entry.quantity, unitPrice: paidItem.unitPrice, unitCost: entry.unitCost,
          } });
          dispensedQuantities.set(paidItem.prescriptionItemId, (dispensedQuantities.get(paidItem.prescriptionItemId) || new Prisma.Decimal(0)).add(entry.quantity));
        }
        allocations.push({ productId: entry.productId, batchId: entry.batchId, quantity: entry.quantity, unitPrice: paidItem.unitPrice, unitCost: entry.unitCost, lineTotal });
      }
      for (const [prescriptionItemId, quantity] of dispensedQuantities) {
        await tx.prescriptionItem.update({ where: { id: prescriptionItemId }, data: { dispensedQuantity: { increment: quantity } } });
      }

      const paidRetailItems = paidRequest.items.filter((item) => item.prescriptionItemId == null);
      const discountResult = { amount: paidRequest.discount, applications: [] };
      const discount = discountResult.amount;
      const containerFee = paidRequest.containerFee;
      const tax = paidRequest.tax;
      const total = paidRequest.total;
      const amountPaid = paidRequest.amountPaid;
      const saleSubtotal = paidRequest.subtotal;
      const sale = await withUniqueRetry(() => tx.sale.create({ data: {
        invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        dispensingId: dispensing.id, patientId: prescription.patient.userId, pharmacistId,
        cashierId: paidRequest.cashierId, paymentRequestId: paidRequest.id,
        subtotal: saleSubtotal, discount, containerFee, tax, total, amountPaid, paymentMethod: paidRequest.paymentMethod,
        status: amountPaid.greaterThanOrEqualTo(total) ? 'PAID' : 'PENDING', items: { create: allocations },
        discountApplications: { create: discountResult.applications },
      } }));

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
