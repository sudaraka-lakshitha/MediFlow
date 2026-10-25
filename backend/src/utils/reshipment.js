import { AppError } from './AppError.js';
import { Prisma } from '@prisma/client';

export const reshipmentSaleSelect = {
  items: { select: { id: true, quantity: true, productId: true, batchId: true,
    product: { select: { genericName: true, strength: true, unit: true } },
    batch: { select: { batchNumber: true, restricted: true, expiryDate: true } },
  } },
  refunds: { where: { status: { in: ['PENDING', 'SETTLED'] } }, select: { lines: { select: { saleItemId: true, quantity: true } } } },
};

// Authorized refunds remove goods immediately, whether or not payout/restocking
// has happened. Decimal arithmetic also supports measured retail quantities.
export function parcelContents(sale) {
  const refunds = (sale?.refunds || []).flatMap(refund => refund.lines || []);
  return (sale?.items || []).map(item => {
    const refunded = refunds.filter(line => line.saleItemId === item.id).reduce((sum, line) => sum.add(line.quantity), new Prisma.Decimal(0));
    const quantity = new Prisma.Decimal(item.quantity).sub(refunded);
    if (quantity.isNegative()) throw new AppError(409, 'Refund quantities exceed the original parcel. Ask the pharmacy to reconcile this order.');
    return { saleItemId: item.id, productId: item.productId, batchId: item.batchId,
      name: [item.product?.genericName, item.product?.strength].filter(Boolean).join(' '), unit: item.product?.unit,
      batchNumber: item.batch?.batchNumber, quantity: quantity.toString(), refundedQuantity: refunded.toString(),
      eligible: Boolean(item.batch && !item.batch.restricted && item.batch.expiryDate > new Date()),
    };
  });
}

export async function assertParcelReshippable(tx, delivery) {
  if (delivery.paymentRequest.status !== 'FULFILLED') throw new AppError(409, 'Only a previously dispatched, paid order can be reshipped.');
  const sale = await tx.sale.findUnique({ where: { paymentRequestId: delivery.paymentRequestId }, select: reshipmentSaleSelect });
  const remaining = parcelContents(sale).filter(line => new Prisma.Decimal(line.quantity).greaterThan(0));
  if (!remaining.length) throw new AppError(409, 'No unrefunded items remain to reship.');
  if (remaining.some(line => !line.eligible)) {
    throw new AppError(409, 'Missing, expired or restricted batches cannot be reshipped. Arrange a pharmacist review and product refund instead.');
  }
  return remaining;
}
