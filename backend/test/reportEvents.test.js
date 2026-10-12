import { describe, expect, it, vi } from 'vitest';
import { reportEvents, eventSummary } from '../src/services/reportEvents.js';
const date = day => new Date(`2026-10-${day}T06:00:00Z`);
const sale = { id: 1, status: 'PAID', invoiceNumber: 'INV-1', createdAt: date('01'), subtotal: 100, discount: 10, tax: 9, containerFee: 5, items: [{ id: 2, quantity: 10, lineTotal: 100, unitCost: 3, batch: { purchasePrice: 3 } }] };
const credit = { id: 3, createdAt: date('03'), sale, amount: 52, lines: [{ id: 4, saleItemId: 2, quantity: 5, stockStatus: 'RESTOCKED', reviewedAt: date('05') }] };
const db = (sales, refunds) => ({ sale: { findMany: vi.fn().mockResolvedValue(sales) }, refund: { findMany: vi.fn().mockResolvedValue(refunds) } });
const bounds = (a, b) => ({ start: new Date(`2026-10-${a}T00:00:00Z`), end: new Date(`2026-10-${b}T00:00:00Z`) });
describe('dated sales, credits and stock recovery', () => {
  it('keeps the original sale intact after later credit and stock review', async () => {
    const rows = await reportEvents(bounds('01','02'), db([{ ...sale, refunds: [credit] }], []));
    expect(rows).toHaveLength(1); expect(rows[0].kind).toBe('SALE');
    expect(eventSummary(rows)).toMatchObject({ netRevenue: 95, cost: 30, profit: 65 });
  });
  it('credits the authorization day without recovering cost or waiting for payout', async () => {
    const rows = await reportEvents(bounds('03','04'), db([], [credit]));
    expect(rows).toHaveLength(1); expect(rows[0].quantity).toBe(-5);
    expect(eventSummary(rows)).toMatchObject({ grossSales: -50, discount: -5, tax: -4.5, containerFee: -2.5, netRevenue: -47.5, cost: 0, profit: -47.5 });
  });
  it('recovers cost only on the actual restock review day', async () => {
    const rows = await reportEvents(bounds('05','06'), db([], [credit]));
    expect(rows).toHaveLength(1); expect(rows[0].kind).toBe('STOCK_RECOVERY');
    expect(eventSummary(rows)).toMatchObject({ netRevenue: 0, cost: -15, profit: 15 });
  });
  it('does not recover cost for pending review, disposal or no return', async () => {
    for (const stockStatus of ['PENDING_REVIEW','DISPOSED','NOT_RETURNED']) {
      const rows = await reportEvents(bounds('05','06'), db([], [{ ...credit, lines: [{ ...credit.lines[0], stockStatus }] }]));
      expect(rows).toHaveLength(0);
    }
  });
  it('combines period totals without double counting credit and recovery', async () => {
    const rows = await reportEvents(bounds('01','06'), db([sale], [credit]));
    expect(rows.map(row => row.kind)).toEqual(['SALE','CREDIT','STOCK_RECOVERY']);
    expect(eventSummary(rows)).toMatchObject({ netRevenue: 47.5, cost: 15, profit: 32.5 });
  });
  it('cancels the full receivable of a part-paid void while retaining the actual deposit payout separately', async () => {
    const cancelled = { ...sale, status: 'VOIDED', amountPaid: 25 };
    const refund = { ...credit, sale: cancelled, amount: 25, lines: [{ ...credit.lines[0], quantity: 10, stockStatus: 'PENDING_REVIEW' }] };
    const rows = await reportEvents(bounds('01','06'), db([cancelled], [refund]));
    expect(eventSummary(rows)).toMatchObject({ netRevenue: 0, cost: 30, profit: -30 });
  });
  it('uses half-open timestamp boundaries', async () => {
    const rows = await reportEvents({ start: date('03'), end: date('05') }, db([], [credit]));
    expect(rows.map(row => row.kind)).toEqual(['CREDIT']);
  });
});
