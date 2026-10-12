import crypto from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { calculateDiscounts } from '../src/services/discount.service.js';
import { reconciliationService } from '../src/services/reconciliation.service.js';
import { localMonthStart, localDateKey } from '../src/utils/localDate.js';

vi.mock('../src/config/env.js', () => ({ env: { REPORT_TIMEZONE_OFFSET_MINUTES: 330 } }));
const d = (value) => new Prisma.Decimal(value);
const rule = (id, value, extra = {}) => ({ id, name: `Offer ${id}`, type: 'FIXED_AMOUNT', value: d(value), scope: 'ORDER', minimumSubtotal: d(0), minimumQuantity: d(0), combinable: true, ...extra });
const allocation = [{ productId: 1, quantity: d(1), lineTotal: d(100) }];
const calculate = (rules, subtotal = 100) => calculateDiscounts({ discountRule: { findMany: async () => rules } }, allocation, d(subtotal));
describe('capped discount application ledger', () => {
  it('allocates stacked discounts in priority order without overstating savings', async () => {
    const result = await calculate([rule(1, 80), rule(2, 80), rule(3, 20)]);
    expect(Number(result.amount)).toBe(100);
    expect(result.applications.map(({ ruleId, amount }) => [ruleId, Number(amount)])).toEqual([[1, 80], [2, 20]]);
  });
  it('keeps uncapped applications unchanged', async () => {
    const result = await calculate([rule(1, 10), rule(2, 20)]);
    expect(result.applications.map(({ amount }) => Number(amount))).toEqual([10, 20]);
    expect(Number(result.amount)).toBe(30);
  });
  it('keeps the winning exclusive discount', async () => {
    const result = await calculate([rule(1, 10), rule(2, 50, { combinable: false })]);
    expect(result.applications.map(({ ruleId }) => ruleId)).toEqual([2]);
    expect(Number(result.amount)).toBe(50);
  });
  it('allocates exact cents and never stores zero-value applications', async () => {
    const result = await calculate([rule(1, '99.99'), rule(2, '.02'), rule(3, 10)]);
    expect(result.applications.map(({ amount }) => amount.toString())).toEqual(['99.99', '0.01']);
    expect(result.applications.reduce((sum, a) => sum.add(a.amount), d(0)).equals(result.amount)).toBe(true);
  });
});

describe('Sri Lanka month boundary', () => {
  it.each([
    ['2026-10-10T10:00:00Z', '2026-09-30T18:30:00.000Z', '2026-10-01'],
    ['2026-09-30T18:30:00Z', '2026-09-30T18:30:00.000Z', '2026-10-01'],
    ['2026-09-30T18:29:59Z', '2026-08-31T18:30:00.000Z', '2026-09-01'],
    ['2026-12-31T18:30:00Z', '2026-12-31T18:30:00.000Z', '2027-01-01'],
    ['2024-02-29T18:30:00Z', '2024-02-29T18:30:00.000Z', '2024-03-01'],
  ])('uses local midnight for %s', (now, expected, key) => {
    const start = localMonthStart(new Date(now));
    expect(start.toISOString()).toBe(expected);
    expect(localDateKey(start)).toBe(key);
  });
});

const user = { id: 5, role: 'CASHIER' };
const day = '2020-10-01';
const ledger = () => ({
  paymentRequestEvent: { findMany: vi.fn().mockResolvedValue([]) },
  salePayment: { findMany: vi.fn().mockResolvedValue([]) },
  refund: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
  sale: { findMany: vi.fn().mockResolvedValue([]) },
  dailyBalanceConfirmation: { findMany: vi.fn().mockResolvedValue([]) },
});
describe('daily balance confirmation scope', () => {
  it('does not invalidate the day when the unrelated pending refund queue changes', async () => {
    const tx = ledger();
    const initial = await reconciliationService.summary(day, user, tx);
    expect(initial.confirmed).toBe(false);
    tx.dailyBalanceConfirmation.findMany.mockResolvedValue([{ fingerprint: initial.fingerprint }]);
    tx.refund.count.mockResolvedValue(12);
    const later = await reconciliationService.summary(day, user, tx);
    expect(later.pendingRefunds).toBe(12);
    expect(later.fingerprint).toBe(initial.fingerprint);
    expect(later.confirmed).toBe(true);
  });
  it('preserves pre-repair confirmations without rewriting historical records', async () => {
    const tx = ledger();
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify({ day, cashierId: user.id, entries: [], pendingRefunds: 3 })).digest('hex');
    tx.dailyBalanceConfirmation.findMany.mockResolvedValue([{ fingerprint, snapshot: { pendingRefunds: 3 } }]);
    tx.refund.count.mockResolvedValue(8);
    expect((await reconciliationService.summary(day, user, tx)).confirmed).toBe(true);
  });
  it('invalidates both old and new confirmations when the actual daily ledger changes', async () => {
    const tx = ledger();
    const initial = await reconciliationService.summary(day, user, tx);
    const legacy = crypto.createHash('sha256').update(JSON.stringify({ day, cashierId: user.id, entries: [], pendingRefunds: 3 })).digest('hex');
    tx.salePayment.findMany.mockResolvedValue([{ id: 1, createdAt: new Date('2020-10-01T10:00:00Z'), sale: { invoiceNumber: 'INV-QA' }, method: 'CASH', amount: 10 }]);
    for (const confirmation of [{ fingerprint: initial.fingerprint }, { fingerprint: legacy, snapshot: { pendingRefunds: 3 } }]) {
      tx.dailyBalanceConfirmation.findMany.mockResolvedValue([confirmation]);
      const later = await reconciliationService.summary(day, user, tx);
      expect(later.confirmed).toBe(false);
      expect(later.totals.CASH.net).toBe(10);
    }
  });
  it('scopes transaction queries by day and cashier, using local midnight', async () => {
    const tx = ledger();
    await reconciliationService.summary(day, user, tx);
    expect(tx.salePayment.findMany.mock.calls[0][0].where).toEqual({ cashierId: 5, createdAt: { gte: new Date('2020-09-30T18:30:00Z'), lt: new Date('2020-10-01T18:30:00Z') } });
  });
});
