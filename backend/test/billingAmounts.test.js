import { describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';
import { cancellationQuote } from '../src/utils/cancellationQuote.js';
import { validatePaymentAmounts } from '../src/utils/paymentAmounts.js';

const d = (n) => new Prisma.Decimal(n);
const bill = (changes = {}) => ({ revision: 2, status: 'PAID', subtotal: d(100), discount: d(40), tax: d(10), containerFee: d(0), total: d(70), amountPaid: d(70), refundedAmount: d(0), couponCode: 'EXPIRED-COUPON', items: [{ id: 1, quantity: d(6), lineTotal: d(60), product: { unit: 'tablet' } }, { id: 2, quantity: d(4), lineTotal: d(40), product: { unit: 'tablet' } }], ...changes });
describe('cancellation pricing', () => {
  it('cancels only the requested units and keeps the rest of the same line', () => {
    const quote = cancellationQuote(bill(), [1], { 1: 2 });
    expect(quote.kept[0].quantity.toString()).toBe('4');
    expect(quote.removed[0].lineTotal.toString()).toBe('20');
    expect(quote.total.toString()).toBe('56');
    expect(quote.refundAmount.toString()).toBe('14');
  });
  it.each([0, -1, 7, 0.5])('rejects invalid tablet cancellation quantity %s', (quantity) => {
    expect(() => cancellationQuote(bill(), [1], { 1: quantity })).toThrow();
  });
  it('preserves the agreed discount and prorates tax without looking up an expired coupon', () => {
    const quote = cancellationQuote(bill(), [2]);
    expect(quote.subtotal.toString()).toBe('60');
    expect(quote.discount.toString()).toBe('24');
    expect(quote.tax.toString()).toBe('6');
    expect(quote.total.toString()).toBe('42');
    expect(quote.refundAmount.toString()).toBe('28');
  });
  it('subtracts prior refunds instead of refunding the same money twice', () => {
    expect(cancellationQuote(bill({ refundedAmount: d(10) }), [2]).refundAmount.toString()).toBe('18');
  });
  it('full cancellation clears all charges', () => {
    const quote = cancellationQuote(bill({ containerFee: d(5), total: d(75), amountPaid: d(75) }), [1, 2]);
    expect(quote.total.toString()).toBe('0');
    expect(quote.refundAmount.toString()).toBe('75');
  });
  it('rejects stale line IDs', () => expect(() => cancellationQuote(bill(), [999])).toThrow('selected items changed'));
  it('never raises a discounted total when removing a line', () => {
    for (let discount = 0; discount <= 100; discount++) {
      const original = bill({ discount: d(discount), total: d(110 - discount), amountPaid: d(110 - discount) });
      expect(cancellationQuote(original, [2]).total.lte(original.total)).toBe(true);
    }
  });
});
describe('server-side payment reconciliation', () => {
  it('accepts exact cash and correct change', () => {
    expect(() => validatePaymentAmounts(75, 'CASH', { tenderedAmount: 100, changeAmount: 25 })).not.toThrow();
  });
  it.each([{ tenderedAmount: 74, changeAmount: 0 }, { tenderedAmount: 100, changeAmount: 0 }, { tenderedAmount: 100.001, changeAmount: 25.001 }, {}])('rejects invalid cash values %o', (details) => {
    expect(() => validatePaymentAmounts(75, 'CASH', details)).toThrow();
  });
  it('validates split sums and the cash component', () => {
    const details = { splitDetails: { isSplit: true, cashAmount: 25, nonCashAmount: 50, cashTendered: 50, change: 25 } };
    expect(() => validatePaymentAmounts(75, 'OTHER', details)).not.toThrow();
    expect(() => validatePaymentAmounts(80, 'OTHER', details)).toThrow('must equal');
    expect(() => validatePaymentAmounts(75, 'CARD', details)).toThrow('Split payments');
    expect(() => validatePaymentAmounts(75, 'OTHER', { ...details, changeAmount: 99 })).toThrow('Conflicting change');
  });
});
