import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { withUniqueRetry } from './withUniqueRetry.js';
import { consumePaymentRequestStock } from './stock.js';
import { cancelPrescriptionQuantity, remainingPrescriptionQuantity } from './prescriptionQuantity.js';
import { latestPartialDecisions, partialReasonLabels, PARTIAL_SUPPLY_EVENT } from './prescriptionBalance.js';
import { batchAllocationOrder, operationSettingsService } from '../services/operationSettings.service.js';

// Shared by the pharmacist's manual "verify PIN and dispense" endpoint and the
// cashier's "dispense at payment" flow: both end with the exact same stock
// consumption, Dispensing/Sale creation, and prescription status update.
export const performPrescriptionDispense = async (tx, { prescriptionId, paymentRequestId, performedById, notes, expectedPickupPinHash, deliveryDispatch = false }) => {
  const delivery = await tx.deliveryRequest?.findUnique({ where: { paymentRequestId } });
  if (!deliveryDispatch && delivery && delivery.status !== 'CANCELLED') throw new AppError(409, 'This order has a delivery request. Use the delivery dispatch workflow.');
  const paidRequest = await tx.paymentRequest.findFirst({ where: { id: paymentRequestId, prescriptionId }, include: { items: { include: { product: true } } } });
  if (!paidRequest || paidRequest.status !== 'PAID') throw new AppError(402, 'Cashier payment has not been completed for this prescription.');
  if (paidRequest.customerCancellationReason) throw new AppError(409, 'Resolve the customer cancellation request before dispensing this order.');
  if (expectedPickupPinHash !== undefined && (paidRequest.pickupPinHash !== expectedPickupPinHash || paidRequest.pinAttempts >= 5)) {
    throw new AppError(409, 'The collection PIN changed or was locked. Use the latest receipt and try again.');
  }

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

  const paidPrescriptionItems = paidRequest.items.filter((item) => item.prescriptionItemId != null);
  for (const paidItem of paidPrescriptionItems) {
    const item = prescription.items.find((candidate) => candidate.id === paidItem.prescriptionItemId);
    if (!item) throw new AppError(404, `Prescription item ${paidItem.prescriptionItemId} was not found.`);
    const requestedQuantity = new Prisma.Decimal(paidItem.quantity);
    const remaining = remainingPrescriptionQuantity(item);
    if (requestedQuantity.greaterThan(remaining)) throw new AppError(409, `${item.product.genericName}: quantity exceeds the prescribed remainder.`);
  }

  const dispensing = await tx.dispensing.create({ data: { prescriptionId, pharmacistId: performedById, notes } });
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
      performedById,
    } });
    if (isPrescriptionItem) {
      await tx.dispensingItem.create({ data: {
        dispensingId: dispensing.id, prescriptionItemId: paidItem.prescriptionItemId, batchId: entry.batchId,
        quantity: entry.quantity, unitPrice: paidItem.unitPrice, unitCost: entry.unitCost,
        dosageInstructions: paidItem.dosageInstructions, specialInstructions: paidItem.specialInstructions,
      } });
      dispensedQuantities.set(paidItem.prescriptionItemId, (dispensedQuantities.get(paidItem.prescriptionItemId) || new Prisma.Decimal(0)).add(entry.quantity));
    }
    allocations.push({ productId: entry.productId, batchId: entry.batchId, quantity: entry.quantity, unitPrice: paidItem.unitPrice, unitCost: entry.unitCost, lineTotal });
  }
  for (const [prescriptionItemId, quantity] of dispensedQuantities) {
    await tx.prescriptionItem.update({ where: { id: prescriptionItemId }, data: { dispensedQuantity: { increment: quantity } } });
  }
  // A walk-in bill may record that the rest of a medicine will not be issued
  // (for example, the customer wanted less). Close that shortfall now it is
  // dispensed, so it is not left pending for a later bill.
  const partialEvents = await tx.paymentRequestEvent?.findMany?.({ where: { paymentRequestId: paidRequest.id, kind: PARTIAL_SUPPLY_EVENT }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], select: { kind: true, details: true } });
  for (const decision of latestPartialDecisions(partialEvents || []).values()) {
    if (decision.issueLater !== false) continue;
    const item = await tx.prescriptionItem.findUnique({ where: { id: Number(decision.prescriptionItemId) } });
    const remaining = item ? remainingPrescriptionQuantity(item) : null;
    if (remaining?.greaterThan(0)) await cancelPrescriptionQuantity(tx, { prescriptionItemId: item.id, quantity: remaining }, `Not issued - ${partialReasonLabels[decision.reason] || 'pharmacy decision'}`);
  }

  const paidRetailItems = paidRequest.items.filter((item) => item.prescriptionItemId == null);
  const discount = paidRequest.discount;
  const containerFee = paidRequest.containerFee;
  const tax = paidRequest.tax;
  const total = paidRequest.total;
  const amountPaid = paidRequest.amountPaid.sub(paidRequest.refundedAmount || 0);
  if (amountPaid.lessThan(total)) throw new AppError(409, 'The net payment no longer covers this invoice. Resolve its balance before dispensing.');
  const saleSubtotal = paidRequest.subtotal;
  const sale = await withUniqueRetry(() => tx.sale.create({ data: {
    invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
    dispensingId: dispensing.id, patientId: prescription.patient.userId, pharmacistId: performedById,
    cashierId: paidRequest.cashierId, paymentRequestId: paidRequest.id,
    subtotal: saleSubtotal, discount, containerFee, tax, total, amountPaid, paymentMethod: paidRequest.paymentMethod,
    status: (paidRequest.status === 'PAID' || amountPaid.greaterThanOrEqualTo(total)) ? 'PAID' : 'PENDING', items: { create: allocations },
  } }));

  const currentItems = await tx.prescriptionItem.findMany({ where: { prescriptionId }, select: { prescribedQuantity: true, dispensedQuantity: true, cancelledQuantity: true } });
  const status = currentItems.every((item) => remainingPrescriptionQuantity(item).lessThanOrEqualTo(0)) ? 'DISPENSED' : 'PARTIALLY_DISPENSED';
  await tx.prescription.update({ where: { id: prescriptionId }, data: { status } });
  return {
    dispensingId: dispensing.id, saleId: sale.id, invoiceNumber: sale.invoiceNumber,
    subtotal: saleSubtotal, discount, total, amountPaid,
    retailItemCount: paidRetailItems.length, paymentStatus: sale.status, prescriptionStatus: status,
  };
};
