import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: {
  prescription: { findMany: vi.fn().mockResolvedValue([]) },
  dispensing: { findMany: vi.fn().mockResolvedValue([]) },
} }));
vi.mock('../src/services/reportEvents.js', async importOriginal => ({
  ...await importOriginal(), reportEvents: vi.fn(),
}));
import { prisma } from '../src/config/prisma.js';
import { reportEvents } from '../src/services/reportEvents.js';
import { reportService } from '../src/services/report.service.js';

const row = id => ({
  sale: { id, pharmacist: { id, fullName: 'Same Name' }, patient: { id, fullName: 'Same Patient' } },
  item: { product: { id, genericName: 'Same Medicine', strength: `${id} mg`, category: { id, name: 'Same Category' } }, batch: { id, batchNumber: 'Same Batch' } },
  date: new Date('2026-10-01T06:00:00Z'), kind: 'SALE', quantity: 1,
  financials: { grossSales: 10, discount: 0, tax: 0, containerFee: 0, netRevenue: 10, cost: 2, profit: 8, margin: 80 },
});
describe('report entity grouping', () => {
  beforeEach(() => {
    reportEvents.mockResolvedValue([row(1), row(2)]);
    prisma.dispensing.findMany.mockResolvedValue([1, 2].map(id => ({ pharmacist: { id, fullName: 'Same Name' } })));
  });
  it('keeps same-name products and staff distinct in analytics', async () => {
    const result = await reportService.analytics('2026-10-01', '2026-10-01');
    expect(result.topProducts.map(product => product.id)).toEqual([1, 2]);
    expect(result.pharmacistActivity).toEqual([
      { id: 1, name: 'Same Name (#1)', count: 1 },
      { id: 2, name: 'Same Name (#2)', count: 1 },
    ]);
  });
  it.each(['product', 'category', 'batch', 'pharmacist', 'patient'])('groups %s by identity rather than name', async group => {
    const result = await reportService.custom('2026-10-01', '2026-10-01', group);
    expect(result.rows).toHaveLength(2);
    expect(result.rows.map(value => value.netRevenue)).toEqual([10, 10]);
  });
  it('includes service income in totals but not top medicine quantities', async () => {
    const service = row(3);
    service.item.isService = true;
    service.quantity = 0;
    reportEvents.mockResolvedValue([row(1), service]);
    const result = await reportService.analytics('2026-10-01', '2026-10-01');
    expect(result.summary.sales).toBe(20);
    expect(result.summary.invoices).toBe(2);
    expect(result.topProducts).toHaveLength(1);
  });
});
