import crypto from 'node:crypto';
import { patientDirections } from '../utils/patientDirections.js';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { prescriptionRepository } from '../repositories/prescription.repository.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { calculateQuantity } from '../utils/dosage.js';
import { assertCouponMatched, calculateDiscounts } from './discount.service.js';
import { normalizeLiquidDose } from '../utils/liquidDose.js';
import { verifyPickupPin } from '../utils/pickupPin.js';
import { operationSettingsService } from './operationSettings.service.js';
import { ageOnDate } from '../utils/age.js';
import { findAgeUnsuitable } from '../utils/ageSuitability.js';
import { withUniqueRetry } from '../utils/withUniqueRetry.js';
import { serializable } from '../utils/serializable.js';
import { usableStockTotal } from '../utils/stock.js';
import { performPrescriptionDispense } from '../utils/prescriptionDispense.js';
import { remainingPrescriptionQuantity } from '../utils/prescriptionQuantity.js';
import { prescriptionMaterialChanged, prescriptionSnapshot } from '../utils/prescriptionRevision.js';
import { planPrescriptionItems } from '../utils/preservePrescriptionItems.js';
const isLiquidProduct = (product) =>
  ['ml', 'millilitre', 'milliliter', 'l', 'litre', 'liter'].includes(String(product?.unit || '').toLowerCase())
  || /syrup|suspension|solution|elixir|liquid/i.test(String(product?.dosageForm || ''));

const validatePatientAge = async (data, products, db = prisma) => {
  let dateOfBirth = data.recipientDateOfBirth;
  if (data.orderedForSelf) {
    const patient = await db.patientProfile.findUnique({ where: { id: data.patientId }, select: { dateOfBirth: true } });
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

const patientView = (prescription) => {
  return {
    ...prescription,
    createdBy: prescription.createdBy ? { id: prescription.createdBy.id, fullName: prescription.createdBy.fullName } : null,
    verifiedBy: prescription.verifiedBy ? { id: prescription.verifiedBy.id, fullName: prescription.verifiedBy.fullName } : null,
    verifiedById: undefined,
    paymentRequest: prescription.paymentRequest ? { ...prescription.paymentRequest, pickupPinHash: undefined, pickupPinEncrypted: undefined, pinAttempts: undefined } : null,
    dispensings: prescription.dispensings?.map((issue) => ({ ...issue, pharmacist: { id: issue.pharmacist.id, fullName: issue.pharmacist.fullName } })),
    // Clinical directions are strictly locked until the cashier confirms payment.
    // Mask ALL intake/schedule fields so patients cannot read dosing instructions
    // before completing payment — not just dosageInstructions and specialInstructions.
    items: patientDirections(prescription),
  };
};


export const prescriptionService = {
  async list(user, pagination) {
    if (user.role !== 'PATIENT') return prescriptionRepository.list({}, pagination);
    const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    return profile ? (await prescriptionRepository.list({ patientId: profile.id }, pagination)).map(patientView) : [];
  },
  async get(id, user) {
    const data = await prescriptionRepository.findById(id);
    if (!data) return null;
    if (user.role === 'PATIENT' && data.patient.user.id !== user.id) throw new AppError(403, 'This prescription does not belong to you.');
    return user.role === 'PATIENT' ? patientView(data) : data;
  },
  async create(data, userId) {
    let sourceUpload = null;
    let patientUserId = null;
    if (data.sourceUploadId) {
      const [upload, profile] = await Promise.all([
        prisma.prescriptionUpload.findUnique({
          where: { id: data.sourceUploadId },
          select: {
            id: true,
            patientId: true,
            status: true,
            prepareRequested: true,
            quoteRevision: true, acknowledgedQuoteRevision: true,
            estimatedTotal: true,
            attachmentRemovedAt: true,
            prescription: { select: { id: true } },
            paymentSlips: {
              where: { status: 'VERIFIED' },
              select: { id: true, declaredAmount: true, reference: true, reviewedById: true, reviewedAt: true },
              orderBy: { reviewedAt: 'desc' },
              take: 1,
            },
          },
        }),
        prisma.patientProfile.findUnique({ where: { id: data.patientId }, select: { userId: true } }),
      ]);
      if (!upload || upload.prescription || !profile || upload.patientId !== profile.userId) {
        throw new AppError(400, 'The uploaded prescription does not belong to the selected patient or is already linked.');
      }
      sourceUpload = upload;
      if (upload.attachmentRemovedAt) throw new AppError(409, 'The source attachment has expired. Ask the customer to submit it again.');
      patientUserId = profile.userId;
      const canIssueFinalInvoice = ['PENDING', 'AVAILABLE', 'PARTIALLY_AVAILABLE', 'QUOTE_SENT'].includes(upload.status);
      const previouslyAcceptedQuote = upload.status === 'QUOTE_ACCEPTED';
      const verifiedPrepaidOrder = upload.status === 'READY_TO_PREPARE';
      if (!canIssueFinalInvoice && !previouslyAcceptedQuote && !verifiedPrepaidOrder) {
        throw new AppError(409, 'This upload is not ready for a final invoice. Review or resolve its current status first.');
      }
      if ((canIssueFinalInvoice || previouslyAcceptedQuote) && !data.sendToCashier) {
        throw new AppError(409, 'An uploaded prescription must be fully reviewed and issued with its final invoice in the same step.');
      }
    } else {
      const profile = await prisma.patientProfile.findUnique({ where: { id: data.patientId }, select: { userId: true } });
      patientUserId = profile?.userId || null;
    }

    const [products, retailProducts] = await Promise.all([
      prisma.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) }, active: true, productType: 'MEDICINE' }, select: { id: true, unit: true, genericName: true, minimumAgeYears: true, maximumAgeYears: true } }),
      prisma.product.findMany({ where: { id: { in: data.retailItems.map((item) => item.productId) }, active: true, prescriptionRequired: false }, select: { id: true, unit: true } }),
    ]);
    if (products.length !== new Set(data.items.map((item) => item.productId)).size) throw new AppError(400, 'One or more selected products are unavailable.');
    if (retailProducts.length !== new Set(data.retailItems.map((item) => item.productId)).size) throw new AppError(400, 'One or more selected retail items are unavailable or require a prescription.');
    for (const item of data.retailItems) stockQuantity(item.quantity, retailProducts.find((product) => product.id === item.productId).unit);
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

    const isPrePaidUpload = sourceUpload && sourceUpload.status === 'READY_TO_PREPARE';
    const shouldVerify = isPrePaidUpload || data.autoVerify || data.sendToCashier;

    return serializable(async (tx) => {
      if (sourceUpload) {
        const claimed = await tx.prescriptionUpload.updateMany({
          where: { id: sourceUpload.id, patientId: patientUserId, status: sourceUpload.status, quoteRevision: sourceUpload.quoteRevision,
            ...(sourceUpload.status === 'QUOTE_ACCEPTED' ? { acknowledgedQuoteRevision: sourceUpload.quoteRevision } : {}),
            attachmentRemovedAt: null, prescription: { is: null } },
          data: { status: sourceUpload.status },
        });
        if (claimed.count !== 1) throw new AppError(409, 'This upload changed or was already processed. Refresh before creating its final invoice.');
      }
      const prescription = await withUniqueRetry(() => tx.prescription.create({ data: {
        prescriptionNumber: `RX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
        patientId: data.patientId, sourceUploadId: data.sourceUploadId || null, isOnline: Boolean(data.sourceUploadId), prescriberTitle: data.prescriberTitle || null,
        prescriberName: data.prescriberName, prescriberReference: data.prescriberReference,
        prescriptionDate: data.prescriptionDate, orderedForSelf:data.orderedForSelf, recipientName:data.orderedForSelf?null:data.recipientName,
        recipientRelationship:data.orderedForSelf?null:data.recipientRelationship,
        recipientDateOfBirth:data.orderedForSelf?null:data.recipientDateOfBirth,
        recipientAllergies:data.orderedForSelf?null:(data.recipientAllergies||null),
        recipientConditions:data.orderedForSelf?null:(data.recipientConditions||null),
        notes: data.notes,
        pickupNote: data.pickupNote || null, plannedPickupAt: data.plannedPickupAt || null,
        createdById: userId,
        refillsAllowed: data.refillsAllowed ?? 0,
        status: shouldVerify ? 'VERIFIED' : 'PENDING',
        verifiedById: shouldVerify ? userId : null,
        verifiedAt: shouldVerify ? new Date() : null,
        items: { create: items },
        retailItems: { create: data.retailItems.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      } }));

    // Handle post-creation workflow actions
    if (isPrePaidUpload) {
      const { paymentRequestService } = await import('./paymentRequest.service.js');
      const verifiedSlip = sourceUpload.paymentSlips?.[0];
      const createdItems = await tx.prescriptionItem.findMany({ where: { prescriptionId: prescription.id } });
      const payInput = {
        items: createdItems.map((item) => ({ prescriptionItemId: item.id, quantity: Number(item.prescribedQuantity) })),
        retailItems: data.retailItems || [],
        couponCode: data.couponCode || null,
        containerFee: Number(data.containerFee || 0),
        tax: Number(data.tax || 0),
      };
      const createdReq = await paymentRequestService.create(prescription.id, payInput, userId, tx);
      const paidTotal = new Prisma.Decimal(verifiedSlip?.declaredAmount || 0);
      if (!paidTotal.equals(createdReq.total)) throw new AppError(409, 'The previously verified transfer does not match the final invoice. Ask the cashier to reconcile the payment; no new prescription or invoice was saved.');
      const { generatePickupPin, hashPickupPin, encryptPickupPin } = await import('../utils/pickupPin.js');
      const { reserveStock } = await import('../utils/stock.js');
      const { batchAllocationOrder } = await import('./operationSettings.service.js');
      {
        const pin = generatePickupPin();
        await tx.paymentRequest.update({
          where: { id: createdReq.id },
          data: {
            status: 'PAID',
            amountPaid: paidTotal,
            paymentMethod: 'BANK_TRANSFER',
            paymentReference: verifiedSlip?.reference || `Upload #${sourceUpload.id} verified slip`,
            cashierId: verifiedSlip?.reviewedById || userId,
            paidAt: verifiedSlip?.reviewedAt || new Date(),
            pickupPinHash: hashPickupPin(createdReq.id, pin),
            pickupPinEncrypted: encryptPickupPin(pin),
          },
        });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: createdReq.id, kind: 'PAYMENT_RECEIVED', amount: paidTotal, revision: createdReq.revision, actorId: verifiedSlip.reviewedById || userId, createdAt: verifiedSlip.reviewedAt || new Date(), details: { source: 'verified_upload_transfer', slipId: verifiedSlip.id } } });
        const opSettings = await operationSettingsService.get(tx);
        const allocationOrder = batchAllocationOrder(opSettings.allocationMethod);
        const prItems = await tx.paymentRequestItem.findMany({ where: { paymentRequestId: createdReq.id } });
        await reserveStock(tx, createdReq.id, prItems, allocationOrder);
      }
    } else if (data.sendToCashier) {
      const { paymentRequestService } = await import('./paymentRequest.service.js');
      const createdItems = await tx.prescriptionItem.findMany({ where: { prescriptionId: prescription.id } });
      const payInput = {
        items: createdItems.map((item) => ({ prescriptionItemId: item.id, quantity: Number(item.prescribedQuantity) })),
        retailItems: data.retailItems || [],
        couponCode: data.couponCode || null,
        containerFee: Number(data.containerFee || 0),
        tax: Number(data.tax || 0),
      };
      await paymentRequestService.create(prescription.id, payInput, userId, tx);
      if (sourceUpload) {
        const issued = await tx.prescriptionUpload.updateMany({
          where: { id: sourceUpload.id, status: sourceUpload.status, prescription: { is: { id: prescription.id } } },
          data: { status: 'PAYMENT_PENDING' },
        });
        if (issued.count !== 1) throw new AppError(409, 'The final invoice was not linked to the upload. Refresh and review its latest status.');
      }
    }

    return tx.prescription.findUnique({ where: { id: prescription.id }, include: { items: { include: { product: true } }, patient: { include: { user: { select: { id: true, fullName: true } } } } } });
    });
  },
  async update(id, data, actorId) {
    return serializable(async (tx) => {
    const current = await tx.prescription.findUnique({ where: { id }, include: { items: true, retailItems: true, paymentRequest: true } });
    if (!current) throw new AppError(404, 'Prescription not found.');
    if (current.sourceUploadId && current.patientId !== data.patientId) throw new AppError(409, 'A customer-uploaded prescription cannot be reassigned to a different customer.');
    if (!['PENDING', 'VERIFIED'].includes(current.status)) throw new AppError(409, 'Only pending or verified prescriptions can be edited.');
    const [products, retailProducts] = await Promise.all([
      tx.product.findMany({ where: { id: { in:data.items.map((item)=>item.productId) }, active:true, productType:'MEDICINE' }, select:{ id:true,unit:true,genericName:true,minimumAgeYears:true,maximumAgeYears:true } }),
      tx.product.findMany({ where: { id: { in:data.retailItems.map((item)=>item.productId) }, active:true, prescriptionRequired:false }, select:{ id:true,unit:true } }),
    ]);
    if(retailProducts.length!==new Set(data.retailItems.map((item)=>item.productId)).size)throw new AppError(400,'One or more selected retail items are unavailable or require a prescription.');
    for (const item of data.retailItems) stockQuantity(item.quantity, retailProducts.find((product) => product.id === item.productId).unit);
    await validatePatientAge(data, products, tx);
    const items=data.items.map((rawItem)=>{const item=normalizeLiquidDose(rawItem);const product=products.find((candidate)=>candidate.id===item.productId);if(!product)throw new AppError(400,'One or more selected products are unavailable.');const{calculated,prescribed,overridden}=calculateQuantity(product.unit,item);return{productId:item.productId,quantityPerDose:item.quantityPerDose,doseInputAmount:item.doseInputAmount,doseInputUnit:item.doseInputUnit,concentrationAmount:item.concentrationAmount,concentrationUnit:item.concentrationUnit,concentrationVolume:item.concentrationVolume,timesPerDay:item.timesPerDay,daysSupply:item.daysSupply,calculatedQuantity:calculated,prescribedQuantity:prescribed,quantityOverridden:overridden,overrideReason:overridden?item.overrideReason:null,dosageInstructions:item.dosageInstructions,frequency:item.frequency,duration:item.duration,notes:item.notes,administrationRoute:item.administrationRoute,mealTiming:item.mealTiming,asNeeded:item.asNeeded,specialInstructions:item.specialInstructions}});
    const proposed = { ...data, items };
    const material = prescriptionMaterialChanged(current, proposed);
    if (current.status === 'PARTIALLY_DISPENSED') {
      const existingIds = new Set(current.items.map((item) => item.id));
      if (data.items.length !== current.items.length || data.items.some((item) => !existingIds.has(Number(item.id)))) {
        throw new AppError(409, 'Keep the existing medicine lines when updating directions for a partially dispensed prescription.');
      }
      const stripDirections = (record) => {
        const snapshot = prescriptionSnapshot(record);
        snapshot.items = snapshot.items.map(({ dosageInstructions, specialInstructions, ...item }) => item);
        return snapshot;
      };
      if (JSON.stringify(stripDirections(current)) !== JSON.stringify(stripDirections(proposed))) {
        throw new AppError(409, 'For a partially dispensed prescription, only directions for medicines with remaining quantity can be changed.');
      }
      const submittedById = new Map(data.items.map((item) => [Number(item.id), item]));
      for (const item of current.items) {
        const submitted = submittedById.get(item.id);
        const directionsChanged = submitted && (String(submitted.dosageInstructions || '').trim() !== String(item.dosageInstructions || '').trim()
          || String(submitted.specialInstructions || '').trim() !== String(item.specialInstructions || '').trim());
        if (directionsChanged && !remainingPrescriptionQuantity(item).greaterThan(0)) {
          throw new AppError(409, 'Directions can only be changed for a medicine that still has quantity remaining.');
        }
      }
    }
    if (material && current.paymentRequest && !['CANCELLED', 'FULFILLED'].includes(current.paymentRequest.status)) {
      throw new AppError(409, 'Withdraw the active cashier bill before changing clinical details. The replacement invoice will need customer approval.');
    }
    const pickupNote = data.pickupNote || null;
    const plannedPickupAt = data.plannedPickupAt || null;
    const metadataChanged = pickupNote !== current.pickupNote || String(plannedPickupAt || '') !== String(current.plannedPickupAt || '');
    if (!material && !metadataChanged) return prescriptionRepository.findById(id, tx);
    const revertToPending = material && current.status === 'VERIFIED';
    const fields = { pickupNote, plannedPickupAt };
    if (material) {
      const plan = planPrescriptionItems(current.items, items, data.items);
      for (const line of plan.updates) await tx.prescriptionItem.update({ where: { id: line.id }, data: line.data });
      if (plan.removed.length) await tx.prescriptionItem.deleteMany({ where: { prescriptionId: id, id: { in: plan.removed } } });
      await tx.prescriptionRetailItem.deleteMany({ where: { prescriptionId: id } });
      Object.assign(fields, {
        patientId: data.patientId, prescriberTitle: data.prescriberTitle || null, prescriberName: data.prescriberName,
        prescriberReference: data.prescriberReference, prescriptionDate: data.prescriptionDate, orderedForSelf: data.orderedForSelf,
        recipientName: data.orderedForSelf ? null : data.recipientName,
        recipientRelationship: data.orderedForSelf ? null : data.recipientRelationship,
        recipientDateOfBirth: data.orderedForSelf ? null : data.recipientDateOfBirth,
        recipientAllergies: data.orderedForSelf ? null : data.recipientAllergies || null,
        recipientConditions: data.orderedForSelf ? null : data.recipientConditions || null,
        notes: data.notes, refillsAllowed: data.refillsAllowed,
        status: revertToPending ? 'PENDING' : undefined, verifiedById: revertToPending ? null : undefined, verifiedAt: revertToPending ? null : undefined,
        items: { create: plan.creates }, retailItems: { create: data.retailItems.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      });
    }
    await tx.prescription.update({ where: { id }, data: fields });
    await tx.auditLog.create({ data: { userId: actorId, action: material ? 'PRESCRIPTION_REVISED' : 'PRESCRIPTION_COLLECTION_UPDATED', entityType: 'PRESCRIPTION', entityId: id,
      details: { previous: prescriptionSnapshot(current), current: prescriptionSnapshot(proposed), verificationRetained: current.status === 'VERIFIED' && !material, previousPickupNote: current.pickupNote || null, pickupNote } } });
    return prescriptionRepository.findById(id, tx);
    });
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
    if (['DISPENSED', 'REJECTED', 'CANCELLED'].includes(current.status)) {
      throw new AppError(409, 'Cannot update collection details for closed prescriptions.');
    }
    const update = {};
    if (Object.hasOwn(data, 'pickupNote')) update.pickupNote = data.pickupNote;
    if (Object.hasOwn(data, 'plannedPickupAt')) update.plannedPickupAt = data.plannedPickupAt;
    if (!Object.keys(update).length) throw new AppError(400, 'Provide pickup details to update.');
    await prisma.prescription.update({
      where: { id },
      data: update,
    });
    const refreshed = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { id: true, fullName: true } } } },
        items: { include: { product: true } }, retailItems: { include: { product: true } },
        createdBy: { select: { id: true, fullName: true, role: true } },
        verifiedBy: { select: { id: true, fullName: true, role: true } },
        dispensings: { include: { sale: true, pharmacist: { select: { id: true, fullName: true, role: true } }, items: { include: { prescriptionItem: { include: { product: true } } } } }, orderBy: { dispensedAt: 'desc' } },
        sourceUpload: { select: { id: true, originalName: true, mimeType: true, status: true } },
        paymentRequest: { include: { cashier: { select: { id: true, fullName: true } }, items: { include: { product: true } }, sale: { select: { id: true, invoiceNumber: true } } } },
      },
    });
    return patientView(refreshed);
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
  // Atomic verify-then-send-to-cashier action.
  // Verifies the prescription if still PENDING, then creates the cashier payment request.
  async sendToCashier(id, userId, input) {
    return serializable(async (tx) => {
    const current = await tx.prescription.findUnique({ where: { id }, include: { items: true, retailItems: true, paymentRequest: true } });
    if (!current) throw new AppError(404, 'Prescription not found.');
    if (!['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'].includes(current.status)) {
      throw new AppError(409, 'Only pending, verified, or partially dispensed prescriptions can be sent to the cashier.');
    }
    if (current.paymentRequest && !['CANCELLED', 'FULFILLED'].includes(current.paymentRequest.status)) {
      throw new AppError(409, 'This prescription already has an active cashier bill.');
    }
    // Verify if still PENDING
    if (current.status === 'PENDING') {
      const verified = await tx.prescription.updateMany({ where: { id, status: 'PENDING' }, data: { status: 'VERIFIED', verifiedById: userId, verifiedAt: new Date() } });
      if (verified.count !== 1) throw new AppError(409, 'This prescription was just processed by another staff member. Refresh and try again.');
    }
    // Create the cashier payment request with both medicine items and retail items
    const { paymentRequestService } = await import('./paymentRequest.service.js');
    const payInput = input || {
      items: current.items.filter((item) => remainingPrescriptionQuantity(item).greaterThan(0))
        .map((item) => ({ prescriptionItemId: item.id, quantity: Number(remainingPrescriptionQuantity(item)) })),
      retailItems: current.retailItems.map((item) => ({ productId: item.productId, quantity: Number(item.quantity) })),
      couponCode: null,
      containerFee: 0,
      tax: 0,
    };
    await paymentRequestService.create(id, payInput, userId, tx);
    return prescriptionRepository.findById(id, tx);
    });
  },
  async refill(id, data, userId) {
    return serializable(async (tx) => {
    const current = await tx.prescription.findUnique({
      where: { id },
      include: { items: true, retailItems: true, patient: true },
    });
    if (!current) throw new AppError(404, 'Prescription not found.');
    if (current.status !== 'DISPENSED') {
      throw new AppError(409, 'Only fully dispensed prescriptions can be refilled.');
    }
    const original = current.originalPrescriptionId
      ? await tx.prescription.findUnique({ where: { id: current.originalPrescriptionId } })
      : current;
    if (!original || original.originalPrescriptionId) throw new AppError(409, 'The original prescription must be reviewed before refilling.');
    const refillsAllowed = Number(original.refillsAllowed || 0);
    const refillsUsed = Number(original.refillsUsed || 0);
    if (refillsUsed >= refillsAllowed) {
      throw new AppError(409, 'All authorized refills have been used.');
    }

    const newRefillsUsed = refillsUsed + 1;
    const items = current.items.map((item) => ({
      productId: item.productId,
      quantityPerDose: item.quantityPerDose,
      doseInputAmount: item.doseInputAmount,
      doseInputUnit: item.doseInputUnit,
      concentrationAmount: item.concentrationAmount,
      concentrationUnit: item.concentrationUnit,
      concentrationVolume: item.concentrationVolume,
      timesPerDay: item.timesPerDay,
      daysSupply: item.daysSupply,
      calculatedQuantity: item.calculatedQuantity,
      prescribedQuantity: item.prescribedQuantity,
      quantityOverridden: item.quantityOverridden,
      overrideReason: item.overrideReason,
      dosageInstructions: item.dosageInstructions,
      frequency: item.frequency,
      duration: item.duration,
      notes: item.notes,
      administrationRoute: item.administrationRoute,
      mealTiming: item.mealTiming,
      asNeeded: item.asNeeded,
      specialInstructions: item.specialInstructions,
    }));

    const refillNote = `Refill #${newRefillsUsed} of ${current.prescriptionNumber}${data?.notes ? ` - ${data.notes}` : ''}`;

      const claimed = await tx.prescription.updateMany({
        where: { id: original.id, refillsUsed, refillsAllowed, status: 'DISPENSED' },
        data: { refillsUsed: { increment: 1 } },
      });
      if (claimed.count !== 1) throw new AppError(409, 'The refill allowance changed. Refresh and try again.');

      const newRx = await withUniqueRetry(() => tx.prescription.create({
        data: {
          prescriptionNumber: `RX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
          patientId: current.patientId,
          prescriberTitle: current.prescriberTitle,
          prescriberName: current.prescriberName,
          prescriberReference: current.prescriberReference,
          prescriptionDate: original.prescriptionDate,
          orderedForSelf: current.orderedForSelf,
          recipientName: current.recipientName,
          recipientRelationship: current.recipientRelationship,
          recipientDateOfBirth: current.recipientDateOfBirth,
          recipientAllergies: current.recipientAllergies,
          recipientConditions: current.recipientConditions,
          notes: current.notes ? `${current.notes} | ${refillNote}` : refillNote,
          pickupNote: current.pickupNote,
          originalPrescriptionId: original.id,
          isOnline: current.isOnline,
          refillsAllowed: 0,
          refillsUsed: 0,
          createdById: userId,
          status: 'PENDING',
          items: { create: items },
          retailItems: { create: current.retailItems.map((r) => ({ productId: r.productId, quantity: r.quantity })) },
        },
      }));

      return tx.prescription.findUnique({
        where: { id: newRx.id },
        include: {
          items: { include: { product: true } },
          retailItems: { include: { product: true } },
          patient: { include: { user: true } },
        },
      });
    });
  },
  async reject(id, reason, userId) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.prescription.findUnique({ where: { id }, select: { paymentRequest: { select: { id: true, status: true } } } });
      if (!current) throw new AppError(404, 'Prescription not found.');
      // Money already changed hands - rejecting here would strand a paid bill that can never be
      // dispensed, so the payment has to be revoked (and refunded) before the clinical rejection.
      if (current.paymentRequest && ['PAID', 'FULFILLED'].includes(current.paymentRequest.status)) {
        throw new AppError(409, current.paymentRequest.status === 'PAID'
          ? 'This prescription has already been paid for. Revoke and refund the cashier bill before rejecting it.'
          : 'This prescription has already been dispensed, so it can no longer be rejected.');
      }
      // The customer may genuinely have transferred the money already, so the slip has to be
      // settled one way or the other before the prescription can be written off.
      if (current.paymentRequest && current.paymentRequest.status === 'SLIP_SUBMITTED') {
        throw new AppError(409, 'A bank transfer slip for this prescription is still being checked. Verify or reject the slip before rejecting the prescription.');
      }
      const rejected = await tx.prescription.updateMany({ where: { id, status: { in: ['PENDING', 'VERIFIED'] } }, data: { status: 'REJECTED', rejectionReason: reason } });
      if (rejected.count !== 1) throw new AppError(409, 'This prescription was just processed by another staff member. Refresh to see its latest status.');
      // A rejected prescription must never leave a payable bill behind for the cashier to collect on.
      if (current.paymentRequest && current.paymentRequest.status === 'AWAITING_PAYMENT') {
        await tx.paymentRequest.updateMany({
          where: { id: current.paymentRequest.id, status: 'AWAITING_PAYMENT' },
          data: { status: 'CANCELLED', cancellationReason: `Prescription rejected: ${reason}`, cancelledById: userId, cancelledAt: new Date() },
        });
      }
      return tx.prescription.findUnique({ where: { id } });
    });
  },

  async quoteDispensing(prescriptionId, input, db = prisma) {
    const prescription = await db.prescription.findUnique({
      where: { id: prescriptionId },
      include: { items: { include: { product: true } }, paymentRequest: { select: { id: true, status: true } } },
    });
    if (!prescription) throw new AppError(404, 'Prescription not found.');
    if (!['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'].includes(prescription.status)) throw new AppError(409, 'This prescription cannot be quoted for dispensing.');

    // A PAID bill already holds a reservation against these exact units. Re-quoting it (e.g. the
    // live preview while the dispense modal is open) must not count that hold against itself, or a
    // bill that reserved the last remaining stock would falsely report itself as insufficient.
    const ownPaymentRequestId = prescription.paymentRequest && !['CANCELLED', 'FULFILLED'].includes(prescription.paymentRequest.status)
      ? prescription.paymentRequest.id
      : null;
    const ownReservations = ownPaymentRequestId
      ? await db.stockReservation.findMany({ where: { paymentRequestId: ownPaymentRequestId }, select: { batchId: true, quantity: true, batch: { select: { productId: true } } } })
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
      const quantity = stockQuantity(requested.quantity, item.product.unit); const remaining = remainingPrescriptionQuantity(item);
      if (quantity.greaterThan(remaining)) throw new AppError(409, `${item.product.genericName}: quantity exceeds the prescribed remainder.`);
      const stock = await db.inventoryBatch.aggregate({ where: { productId: item.productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, _sum: { quantityAvailable: true, quantityReserved: true } });
      const reservedByOthers = (stock._sum.quantityReserved || new Prisma.Decimal(0)).sub(ownReservedByProduct.get(item.productId) || 0);
      const available = (stock._sum.quantityAvailable || new Prisma.Decimal(0)).sub(reservedByOthers);
      if (available.lessThan(quantity)) throw new AppError(409, `Insufficient usable stock for ${item.product.genericName}.`);
      const lineTotal = item.product.sellingPrice.mul(quantity).toDecimalPlaces(2); subtotal = subtotal.add(lineTotal);
      allocations.push({ productId: item.productId, categoryId: item.product.categoryId, quantity, unitPrice: item.product.sellingPrice, lineTotal });
      lines.push({ source: 'PRESCRIPTION', prescriptionItemId: item.id, productId: item.productId, name: `${item.product.genericName} ${item.product.strength}`, unit: item.product.unit, quantity, unitPrice: item.product.sellingPrice, lineTotal, dosageInstructions: item.dosageInstructions, specialInstructions: item.specialInstructions });
    }

    const retailRequests = input.retailItems || [];
    const retailProductIds = [...new Set(retailRequests.map((item) => item.productId))];
    const retailProducts = retailProductIds.length ? await db.product.findMany({
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
      const quantity = stockQuantity(requested.quantity, product.unit);
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
    const discountResult = assertCouponMatched(await calculateDiscounts(db, allocations, subtotal, input.couponCode));
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
    const operationSettings = await operationSettingsService.get();
    const pinRequired = operationSettings.requirePickupPin;
    if (!input.paymentRequestId || (pinRequired && !input.pickupPin)) {
      throw new AppError(402, pinRequired
        ? 'Every prescription must be paid at the cashier and verified with the receipt PIN before dispensing.'
        : 'Every prescription must be paid at the cashier before dispensing.');
    }
    const paidRequest = await prisma.paymentRequest.findFirst({ where: { id: input.paymentRequestId, prescriptionId }, include: { items: { include: { product: true } } } });
    if (!paidRequest || paidRequest.status !== 'PAID') throw new AppError(402, 'Cashier payment has not been completed for this prescription.');
    if (pinRequired) {
      if (paidRequest.pinAttempts >= 5) throw new AppError(423, 'The receipt PIN is locked after too many failed attempts. Ask an administrator for assistance.');
      if (!verifyPickupPin(paidRequest.id, input.pickupPin, paidRequest.pickupPinHash)) {
        await prisma.paymentRequest.update({ where: { id: paidRequest.id }, data: { pinAttempts: { increment: 1 } } });
        throw new AppError(400, 'The receipt PIN is incorrect.');
      }
    }
    const paidPrescriptionItems = paidRequest.items.filter((item) => item.prescriptionItemId != null);
    const paidItems = new Map(paidPrescriptionItems.map((item) => [item.prescriptionItemId, Number(item.quantity)]));
    if (paidPrescriptionItems.length !== input.items.length || input.items.some((item) => Number(item.quantity) !== Number(paidItems.get(item.prescriptionItemId)))) {
      throw new AppError(409, 'Dispensing quantities must exactly match the paid cashier request.');
    }
    return serializable((tx) => performPrescriptionDispense(tx, { prescriptionId, paymentRequestId: paidRequest.id, performedById: pharmacistId, notes: input.notes, expectedPickupPinHash: pinRequired ? paidRequest.pickupPinHash : undefined }));
  },
};
