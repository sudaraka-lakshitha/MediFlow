import { expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { refundService } from '../src/services/refund.service.js';
import { saleFinancials } from '../src/utils/reportFinancials.js';
import { reportEvents, eventSummary } from '../src/services/reportEvents.js';
const D = value => new Prisma.Decimal(value);
const makeSale = (quantity = 3, discount = 1, fee = 0.01, tax = 0.02) => ({
  id: 1, status: 'PAID', createdAt: new Date('2026-10-01'), invoiceNumber: 'ROUNDING',
  subtotal: D(3 * quantity), discount: D(discount), containerFee: D(fee), tax: D(tax),
  total: D(3 * quantity).sub(discount).add(fee).add(tax), amountPaid: D(3 * quantity).sub(discount).add(fee).add(tax),
  refunds: [], items: [1, 2, 3].map(id => ({ id, productId: id, batchId: id, quantity: D(quantity), lineTotal: D(quantity), unitCost: D(0.1),
    product: { id, genericName: `Item ${id}`, unit: 'tablet' }, batch: { purchasePrice: D(0.1) } })),
});
const addRefund = (sale, quote) => {
  const id = sale.refunds.length + 1;
  sale.refunds.push({ id, saleId: sale.id, status: 'PENDING', createdAt: new Date(Date.UTC(2026, 9, 2, 0, 0, id)), amount: quote.amount,
    lines: quote.lines.map((line, index) => ({ ...line, id: id * 10 + index, stockStatus: 'PENDING_REVIEW' })) });
};
const checkReports = async sale => {
  const db = { sale: { findMany: vi.fn().mockResolvedValue([sale]) }, refund: { findMany: vi.fn().mockResolvedValue(sale.refunds.map(refund => ({ ...refund, sale }))) } };
  const events = await reportEvents({ start: new Date('2026-10-01'), end: new Date('2026-10-04') }, db);
  expect(eventSummary(events)).toEqual(saleFinancials(sale));
  const credits = events.filter(event => event.kind === 'CREDIT');
  for (const credit of credits) {
    const line = sale.refunds.flatMap(refund => refund.lines).find(line => credit.key.endsWith(`-${line.id}`));
    expect(D(credit.financials.netRevenue).add(credit.financials.tax).toNumber()).toBe(-Number(line.amount));
  }
};
it('returns all cents exactly across nine partial returns and agrees with dated reports', async () => {
  const sale = makeSale();
  const tx = { sale: { findUnique: vi.fn().mockResolvedValue(sale) } };
  for (let quantity = 0; quantity < 3; quantity++) for (const item of sale.items) {
    const quote = await refundService.saleQuote(tx, sale.id, { expectedRefundCount: sale.refunds.length, items: [{ saleItemId: item.id, quantity: 1 }] });
    addRefund(sale, quote);
    const credited = sale.refunds.reduce((sum, refund) => sum.add(refund.amount), D(0));
    const summary = saleFinancials(sale);
    expect(D(summary.netRevenue).add(summary.tax).toNumber()).toBe(sale.total.sub(credited).toNumber());
    await checkReports(sale);
  }
  expect(sale.refunds.reduce((sum, refund) => sum.add(refund.amount), D(0)).equals(sale.total)).toBe(true);
  expect(saleFinancials(sale)).toMatchObject({ grossSales: 0, discount: 0, containerFee: 0, tax: 0, netRevenue: 0, cost: 0.9 });
});
it('honours historical refund cents without rewriting or returning extra money', async () => {
  const sale = makeSale(1, 1, 0, 0);
  addRefund(sale, { amount: D(0.67), lines: [{ saleItemId: 1, quantity: D(1), amount: D(0.67) }] });
  const tx = { sale: { findUnique: vi.fn().mockResolvedValue(sale) } };
  for (const id of [2, 3]) addRefund(sale, await refundService.saleQuote(tx, 1, { expectedRefundCount: sale.refunds.length, items: [{ saleItemId: id, quantity: 1 }] }));
  expect(sale.refunds.map(refund => Number(refund.amount))).toEqual([0.67, 0.67, 0.66]);
  expect(saleFinancials(sale).netRevenue).toBe(0);
  await checkReports(sale);
});
