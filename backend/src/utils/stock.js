// SETTING STOCK ASIDE AND TAKING IT OFF THE SHELF
// Simple picture:
//   1. reserveStock: when a bill is paid (or a prepared order is billed), the medicine is "set
// aside".
//      The shelf count does not change; only quantity_reserved goes up.
//   2. releaseReservations: if the bill is cancelled or the hold runs out, the set-aside stock is
// freed.
//   3. consumePaymentRequestStock: when the medicine is handed over, the set-aside stock is removed
//      from the shelf for real (quantity_available and quantity_reserved both go down).
// The stock_reservations table remembers exactly which batch each set-aside amount came from.

import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

// "Usable" stock for a *new* commitment (quoting/selling) must exclude
// whatever is already reserved against a paid-but-not-yet-fulfilled bill.
export const usableQuantity = (batch) => batch.quantityAvailable.sub(batch.quantityReserved);
export const usableStockTotal = (batches) => batches.reduce((sum, batch) => sum.add(usableQuantity(batch)), new Prisma.Decimal(0));

// Called once, at the moment a bill is paid: locks in which specific
// batches will cover it (FIFO/FEFO over what isn't already reserved) so the
// stock can't be sold out from under a paying customer before pickup.
// shortage lets callers explain a failed hold in their own context (for
// example, a hold made when a prepared order is billed rather than at payment).
export const reserveStock = async (tx, paymentRequestId, items, allocationOrder, shortage = {}) => {
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
      const { purpose = 'to complete this payment', advice = 'Ask the pharmacist to update the bill.' } = shortage;
      throw new AppError(409, `Insufficient usable stock for ${product?.genericName || 'a requested item'} ${purpose}. ${advice}`);
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
    // Several invoice lines can reserve the same batch. Deduct from the live
    // balance, then derive movement totals from the updated row rather than the
    // batch snapshot shared by the reservations loaded above.
    const updatedBatch = await tx.inventoryBatch.update({
      where: { id: reservation.batchId },
      data: {
        quantityAvailable: { decrement: reservation.quantity },
        quantityReserved: { decrement: reservation.quantity },
      },
    });
    const quantityAfter = updatedBatch.quantityAvailable;
    const quantityBefore = quantityAfter.add(reservation.quantity);
    consumed.push({ paymentRequestItemId: reservation.paymentRequestItemId, productId: reservation.batch.productId, batchId: reservation.batchId, quantity: reservation.quantity, quantityBefore, quantityAfter, unitCost: reservation.batch.purchasePrice });
  }
  if (reservations.length) await tx.stockReservation.deleteMany({ where: { paymentRequestId } });
  return consumed;
};

// True when the set-aside stock no longer matches the bill (for example a batch expired or the bill
// changed), so it must be set aside again from fresh batches.
const reservationsNeedReallocation = (reservations, items, now = new Date()) => {
  if (!reservations.length) return false;
  const reservedByItem = new Map();
  for (const reservation of reservations) {
    reservedByItem.set(
      reservation.paymentRequestItemId,
      (reservedByItem.get(reservation.paymentRequestItemId) || new Prisma.Decimal(0)).add(reservation.quantity),
    );
    if (
      reservation.batch.expiryDate < now
      || reservation.batch.restricted
      || reservation.batch.quantityAvailable.lessThan(reservation.quantity)
      || reservation.batch.quantityReserved.lessThan(reservation.quantity)
    ) return true;
  }
  return items.some((item) => !(reservedByItem.get(item.id) || new Prisma.Decimal(0)).equals(item.quantity));
};

// Fresh FIFO/FEFO allocation for a single item — the only path used before
// reservations existed. Kept as a fallback for any bill that was already
// marked PAID before this shipped (and so has no StockReservation rows).
const allocateFresh = async (tx, paymentRequestItemId, productId, quantity, allocationOrder) => {
  const now = new Date();
  const batches = await tx.inventoryBatch.findMany({ where: { productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, orderBy: allocationOrder });
  const available = usableStockTotal(batches);
  if (available.lessThan(quantity)) {
    const product = await tx.product.findUnique({ where: { id: productId }, select: { genericName: true } });
    throw new AppError(409, `Insufficient usable stock for ${product?.genericName || 'a requested item'}.`);
  }
  const consumed = [];
  let left = new Prisma.Decimal(quantity);
  for (const batch of batches) {
    if (left.isZero()) break;
    const usable = usableQuantity(batch);
    if (usable.lessThanOrEqualTo(0)) continue;
    const take = Prisma.Decimal.min(left, usable);
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
  const existing = await tx.stockReservation.findMany({
    where: { paymentRequestId: paymentRequest.id },
    include: { batch: true },
  });
  if (reservationsNeedReallocation(existing, paymentRequest.items)) {
    await releaseReservations(tx, paymentRequest.id);
    await reserveStock(tx, paymentRequest.id, paymentRequest.items, allocationOrder);
  }
  const reserved = await consumeReservations(tx, paymentRequest.id);
  if (reserved.length) return reserved;
  const consumed = [];
  for (const item of paymentRequest.items) {
    consumed.push(...await allocateFresh(tx, item.id, item.productId, item.quantity, allocationOrder));
  }
  return consumed;
};
