import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFile } from 'node:fs/promises';
import { readProductWorkbook } from '../src/services/productWorkbook.service.js';
import { readStockWorkbook } from '../src/services/stockWorkbook.service.js';
import { buildBulkPlan } from '../src/services/productBulk.service.js';
import { stockBulkPlan } from '../src/services/stockBulk.service.js';
import { parseCsv } from '../../frontend/src/utils/csv.ts';
vi.mock('../src/config/prisma.js', () => ({ prisma: {} }));
describe('published demonstration workbooks', () => {
  beforeEach(() => vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-10-28T00:00:00Z').getTime()));
  afterEach(() => vi.restoreAllMocks());
  it('ships CSV equivalents with the same record counts and leading text identifiers', async()=>{
    const products=parseCsv(await readFile(new URL('../../data/demo/MediFlow_Demo_Products.csv',import.meta.url),'utf8'));
    const stock=parseCsv(await readFile(new URL('../../data/demo/MediFlow_Demo_Stock.csv',import.meta.url),'utf8'));
    expect(products).toHaveLength(389);expect(stock).toHaveLength(397);
    expect(products[0].sku).toBe(stock[0].sku);expect(stock[0].expiry_date).toBe('2027-01-15');
  });
  it('imports all products and matching batches through the real upload parsers and planners', async () => {
    const products = await readProductWorkbook(await readFile(new URL('../../data/demo/MediFlow_Demo_Products.xlsx', import.meta.url)));
    const stock = await readStockWorkbook(await readFile(new URL('../../data/demo/MediFlow_Demo_Stock.xlsx', import.meta.url)));
    expect(products).toHaveLength(389); expect(stock).toHaveLength(397);
    const productPlan = await buildBulkPlan({ product: { findMany: async () => [] } }, products);
    expect(productPlan.summary.errors).toEqual([]);
    const productRows = productPlan.plans.map((p, i) => ({ ...p.next, id: i+1 }));
    const stockPlan = await stockBulkPlan({ product: { findMany: async () => productRows }, supplier: { findMany: async () => [] }, inventoryBatch: { findUnique: async () => null } }, stock);
    expect(stockPlan.errors).toEqual([]);
    expect(stockPlan.summary.validUpdates).toBe(397);
    expect(stockPlan.plans.every(p => p.quantityAfter > 0 && p.supplierId === null)).toBe(true);
  });
});
