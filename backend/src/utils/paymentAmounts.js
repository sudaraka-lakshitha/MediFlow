// Checks cash, card and split payments add up to the bill total.

import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';

const money = (value) => {
  const result = new Prisma.Decimal(value ?? 0);
  if (!result.isFinite() || result.isNegative() || !result.equals(result.toDecimalPlaces(2))) throw new AppError(400, 'Payment amounts must be non-negative amounts with at most two decimal places.');
  return result;
};
export const validatePaymentAmounts = (totalValue, method, details = {}) => {
  const total = money(totalValue);
  if (details.splitDetails?.isSplit) {
    if (method !== 'OTHER') throw new AppError(400, 'Split payments must use the split payment method.');
    const split = details.splitDetails;
    const cash = money(split.cashAmount), nonCash = money(split.nonCashAmount);
    if (!cash.add(nonCash).equals(total)) throw new AppError(400, 'Split payment amounts must equal the invoice total.');
    const tendered = money(split.cashTendered ?? details.tenderedAmount);
    const change = money(split.change ?? details.changeAmount);
    if (tendered.lessThan(cash) || !tendered.sub(cash).equals(change)) throw new AppError(400, 'Cash tendered and change do not match the cash portion.');
    if (details.tenderedAmount != null && !money(details.tenderedAmount).equals(tendered)) throw new AppError(400, 'Conflicting cash tendered amounts.');
    if (details.changeAmount != null && !money(details.changeAmount).equals(change)) throw new AppError(400, 'Conflicting change amounts.');
  } else if (method === 'CASH') {
    if (details.tenderedAmount == null) throw new AppError(400, 'Enter the cash tendered by the customer.');
    const tendered = money(details.tenderedAmount), change = money(details.changeAmount);
    if (tendered.lessThan(total) || !tendered.sub(total).equals(change)) throw new AppError(400, 'Cash tendered and change must reconcile with the invoice total.');
  } else if (details.changeAmount != null && !money(details.changeAmount).isZero()) {
    throw new AppError(400, 'Change can only be recorded against a cash payment.');
  }
};
