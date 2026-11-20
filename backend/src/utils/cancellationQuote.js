// Works out the new total and the refund when lines are removed from a bill.

import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { stockQuantity } from './stockQuantity.js';

// Cancellation preserves the agreed effective discount/tax rates. It never
// reprices the remaining goods using today's coupons or promotions.
export const cancellationQuote = (bill, itemIds, quantities = {}) => {
  const ids = new Set(itemIds.map(Number));
  const removed = bill.items.filter((item) => ids.has(item.id)).map((item) => {
    const quantity = new Prisma.Decimal(quantities[item.id] ?? item.quantity);
    if (!quantity.greaterThan(0) || quantity.greaterThan(item.quantity) || quantity.decimalPlaces() > 3) throw new AppError(400, 'Cancellation quantity must be within the remaining billed quantity.');
    stockQuantity(quantity, item.product?.unit);
    return { ...item, quantity, lineTotal: new Prisma.Decimal(item.lineTotal).mul(quantity).div(item.quantity).toDecimalPlaces(2) };
  });
  if (!removed.length || removed.length !== ids.size) throw new AppError(409, 'The selected items changed. Refresh the invoice before cancelling.');
  const kept = bill.items.flatMap((item) => {
    const cancelled = removed.find((line) => line.id === item.id);
    if (!cancelled) return [item];
    const quantity = new Prisma.Decimal(item.quantity).sub(cancelled.quantity);
    return quantity.greaterThan(0) ? [{ ...item, quantity, lineTotal: new Prisma.Decimal(item.lineTotal).sub(cancelled.lineTotal) }] : [];
  });
  const subtotal = kept.reduce((sum, item) => sum.add(item.lineTotal), new Prisma.Decimal(0)).toDecimalPlaces(2);
  const ratio = bill.subtotal.isZero() ? new Prisma.Decimal(0) : subtotal.div(bill.subtotal);
  const discount = Prisma.Decimal.min(subtotal, bill.discount.mul(ratio).toDecimalPlaces(2));
  const tax = bill.tax.mul(ratio).toDecimalPlaces(2);
  const liquidRemains = kept.some(({ product }) => ['ml', 'millilitre', 'milliliter', 'l', 'litre', 'liter'].includes(String(product?.unit || '').toLowerCase()) || /syrup|suspension|solution|elixir|liquid/i.test(String(product?.dosageForm || '')));
  const containerFee = liquidRemains ? bill.containerFee : new Prisma.Decimal(0);
  const total = Prisma.Decimal.max(0, subtotal.sub(discount).add(tax).add(containerFee)).toDecimalPlaces(2);
  if (total.greaterThan(bill.total)) throw new AppError(409, 'This cancellation would increase the invoice. Review its original amounts before proceeding.');
  const netPaid = new Prisma.Decimal(bill.amountPaid).sub(bill.refundedAmount ?? 0);
  const refundAmount = bill.status === 'PAID' ? Prisma.Decimal.max(0, netPaid.sub(total)) : new Prisma.Decimal(0);
  return { subtotal, discount, tax, containerFee, total, refundAmount, removed, kept, revision: bill.revision };
};
