import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

// "Usable" stock for a *new* commitment (quoting/selling) must exclude
// whatever is already reserved against a paid-but-not-yet-fulfilled bill.
export const usableQuantity = (batch) => batch.quantityAvailable.sub(batch.quantityReserved);
export const usableStockTotal = (batches) => batches.reduce((sum, batch) => sum.add(usableQuantity(batch)), new Prisma.Decimal(0));

// Called once, at the moment a bill is paid: locks in which specific
// batches will cover it (FIFO/FEFO over what isn't already reserved) so the
// stock can't be sold out from under a paying customer before pickup.
export const reserveStock = async (tx, paymentRequestId, items, allocationOrder) => {
  const now = new Date();
  for (const item of items) {
    const quantity = new Prisma.Decimal(item.quantity);
    const batches = await tx.inventoryBatch.findMany({
      where: { productId: item.productId, expiryDate: { gte: now }, restricted: false, quantityAvailable: { gt: 0 } },
      orderBy: allocationOrder,
    });
    let left = quantity;
    for (const batch of batches) {
      if (left.isZero()) break;
      const usable = usableQuantity(batch);
      if (usable.lessThanOrEqualTo(0)) continue;
      const take = Prisma.Decimal.min(left, usable);
      await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityReserved: { increment: take } } });
      await tx.stockReservation.create({ data: { paymentRequestId, paymentRequestItemId: item.id, batchId: batch.id, quantity: take } });
      left = left.sub(take);
    }
    if (left.greaterThan(0)) {
      const product = await tx.product.findUnique({ where: { id: item.productId }, select: { genericName: true } });
      throw new AppError(409, `Insufficient usable stock for ${product?.genericName || 'a requested item'} to complete this payment. Ask the pharmacist to update the bill.`);
    }
  }
};

// Releases a bill's reservations (revoke/cancel) without touching quantityAvailable — nothing was ever deducted, only held.
export const releaseReservations = async (tx, paymentRequestId) => {
  const reservations = await tx.stockReservation.findMany({ where: { paymentRequestId } });
  for (const reservation of reservations) {
    await tx.inventoryBatch.update({ where: { id: reservation.batchId }, data: { quantityReserved: { decrement: reservation.quantity } } });
  }
  if (reservations.length) await tx.stockReservation.deleteMany({ where: { paymentRequestId } });
};

// Turns a bill's reservations into an actual stock deduction at hand-over
// time, returning one entry per (item, batch) split for the caller to build
// SaleItem/DispensingItem/StockMovement rows from.
const consumeReservations = async (tx, paymentRequestId) => {
  const reservations = await tx.stockReservation.findMany({ where: { paymentRequestId }, include: { batch: true } });
  const consumed = [];
  for (const reservation of reservations) {
    const quantityBefore = reservation.batch.quantityAvailable;
    const quantityAfter = quantityBefore.sub(reservation.quantity);
    await tx.inventoryBatch.update({ where: { id: reservation.batchId }, data: { quantityAvailable: quantityAfter, quantityReserved: { decrement: reservation.quantity } } });
    consumed.push({ paymentRequestItemId: reservation.paymentRequestItemId, productId: reservation.batch.productId, batchId: reservation.batchId, quantity: reservation.quantity, quantityBefore, quantityAfter, unitCost: reservation.batch.purchasePrice });
  }
  if (reservations.length) await tx.stockReservation.deleteMany({ where: { paymentRequestId } });
  return consumed;
};

// Fresh FIFO/FEFO allocation for a single item — the only path used before
// reservations existed. Kept as a fallback for any bill that was already
// marked PAID before this shipped (and so has no StockReservation rows).
const allocateFresh = async (tx, paymentRequestItemId, productId, quantity, allocationOrder) => {
  const now = new Date();
  const batches = await tx.inventoryBatch.findMany({ where: { productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, orderBy: allocationOrder });
  const available = batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
  if (available.lessThan(quantity)) {
    const product = await tx.product.findUnique({ where: { id: productId }, select: { genericName: true } });
    throw new AppError(409, `Insufficient usable stock for ${product?.genericName || 'a requested item'}.`);
  }
  const consumed = [];
  let left = new Prisma.Decimal(quantity);
  for (const batch of batches) {
    if (left.isZero()) break;
    const take = Prisma.Decimal.min(left, batch.quantityAvailable);
    const quantityAfter = batch.quantityAvailable.sub(take);
    await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: quantityAfter } });
    consumed.push({ paymentRequestItemId, productId, batchId: batch.id, quantity: take, quantityBefore: batch.quantityAvailable, quantityAfter, unitCost: batch.purchasePrice });
    left = left.sub(take);
  }
  return consumed;
};

// Single entry point fulfillment code calls: consume this bill's
// reservations if it has any, otherwise fall back to allocating fresh
// (a bill paid before reservations existed).
export const consumePaymentRequestStock = async (tx, paymentRequest, allocationOrder) => {
  const reserved = await consumeReservations(tx, paymentRequest.id);
  if (reserved.length) return reserved;
  const consumed = [];
  for (const item of paymentRequest.items) {
    consumed.push(...await allocateFresh(tx, item.id, item.productId, item.quantity, allocationOrder));
  }
  return consumed;
};
