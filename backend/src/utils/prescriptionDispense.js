import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { withUniqueRetry } from './withUniqueRetry.js';
import { consumePaymentRequestStock } from './stock.js';
import { batchAllocationOrder, operationSettingsService } from '../services/operationSettings.service.js';

// Shared by the pharmacist's manual "verify PIN and dispense" endpoint and the
// cashier's "dispense at payment" flow: both end with the exact same stock
// consumption, Dispensing/Sale creation, and prescription status update.
export const performPrescriptionDispense = async (tx, { prescriptionId, paymentRequestId, performedById, notes }) => {
  const paidRequest = await tx.paymentRequest.findFirst({ where: { id: paymentRequestId, prescriptionId }, include: { items: { include: { product: true } } } });
  if (!paidRequest || paidRequest.status !== 'PAID') throw new AppError(402, 'Cashier payment has not been completed for this prescription.');

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
    const remaining = item.prescribedQuantity.sub(item.dispensedQuantity);
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
      } });
      dispensedQuantities.set(paidItem.prescriptionItemId, (dispensedQuantities.get(paidItem.prescriptionItemId) || new Prisma.Decimal(0)).add(entry.quantity));
    }
    allocations.push({ productId: entry.productId, batchId: entry.batchId, quantity: entry.quantity, unitPrice: paidItem.unitPrice, unitCost: entry.unitCost, lineTotal });
  }
  for (const [prescriptionItemId, quantity] of dispensedQuantities) {
    await tx.prescriptionItem.update({ where: { id: prescriptionItemId }, data: { dispensedQuantity: { increment: quantity } } });
  }

  const paidRetailItems = paidRequest.items.filter((item) => item.prescriptionItemId == null);
  const discount = paidRequest.discount;
  const containerFee = paidRequest.containerFee;
  const tax = paidRequest.tax;
  const total = paidRequest.total;
  const amountPaid = paidRequest.amountPaid;
  const saleSubtotal = paidRequest.subtotal;
  const sale = await withUniqueRetry(() => tx.sale.create({ data: {
    invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
    dispensingId: dispensing.id, patientId: prescription.patient.userId, pharmacistId: performedById,
    cashierId: paidRequest.cashierId, paymentRequestId: paidRequest.id,
    subtotal: saleSubtotal, discount, containerFee, tax, total, amountPaid, paymentMethod: paidRequest.paymentMethod,
    status: amountPaid.greaterThanOrEqualTo(total) ? 'PAID' : 'PENDING', items: { create: allocations },
  } }));

  const currentItems = await tx.prescriptionItem.findMany({ where: { prescriptionId }, select: { prescribedQuantity: true, dispensedQuantity: true } });
  const status = currentItems.every((item) => item.dispensedQuantity.greaterThanOrEqualTo(item.prescribedQuantity)) ? 'DISPENSED' : 'PARTIALLY_DISPENSED';
  await tx.prescription.update({ where: { id: prescriptionId }, data: { status } });
  return {
    dispensingId: dispensing.id, saleId: sale.id, invoiceNumber: sale.invoiceNumber,
    subtotal: saleSubtotal, discount, total, amountPaid,
    retailItemCount: paidRetailItems.length, paymentStatus: sale.status, prescriptionStatus: status,
  };
};
