import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { buildBulkPlan, parseBulkRow, productBulkService } from '../src/services/productBulk.service.js';
import { productTemplateRows, productBulkFields } from '../src/utils/productBulkFormat.js';
import { productUpdateRow, stockExportTotals } from '../src/services/adminExport.service.js';
import { toCsv } from '../src/utils/csv.js';
import { exportPages } from '../src/utils/exportPages.js';
import { parseCsv } from '../../frontend/src/utils/csv.ts';
const { db } = vi.hoisted(() => ({ db: { product: { findMany: vi.fn(), update: vi.fn(), create: vi.fn() }, category: { upsert: vi.fn() }, manufacturer: { upsert: vi.fn() }, drugConcept: { upsert: vi.fn() }, lowStockAcknowledgement: { deleteMany: vi.fn() }, auditLog: { findFirst: vi.fn(), create: vi.fn() }, $transaction: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
const current = () => ({ ...productTemplateRows[0], id: 1, sku: 'MED-EXISTING', sellingPrice: new Prisma.Decimal(12.50), active: false, brandName: 'Existing brand', manufacturerName: null, manufacturer: { id: 2, name: 'Existing maker' }, manufacturerId: 2, categoryId: 3, category: { id: 3, name: 'Existing category' }, barcode: '00001234', minimumAgeYears: 12, maximumAgeYears: 80, storageInstructions: 'Keep dry', drugConceptId: 4, updatedAt: new Date('2026-10-11T00:00:00Z'), _count: { batches: 1 } });
beforeEach(() => {
  vi.resetAllMocks(); db.product.findMany.mockResolvedValue([current()]);
  db.$transaction.mockImplementation((fn) => fn(db)); db.auditLog.findFirst.mockResolvedValue(null);
  db.product.update.mockImplementation(({ data }) => Promise.resolve({ ...current(), ...data }));
  db.product.create.mockImplementation(({ data }) => Promise.resolve({ id: 5, ...data }));
  db.category.upsert.mockResolvedValue({ id: 3 }); db.manufacturer.upsert.mockResolvedValue({ id: 2 }); db.drugConcept.upsert.mockResolvedValue({ id: 4 });
});
const apply = async (rows) => { const preview = await productBulkService.run(rows, true); expect(preview.errors).toEqual([]); return productBulkService.run(rows, false, { previewToken: preview.previewToken, userId: 10 }); };

describe('bulk product preserve and clear semantics', () => {
  it('updates a price only without touching any other saved field', async () => {
    await apply([{ SKU: 'MED-EXISTING', 'Selling price (Rs.)': '20.00', 'Storage instructions': '', 'Minimum age (years)': '' }]);
    expect(db.product.update.mock.calls[0][0].data).toEqual({ sellingPrice: 20 });
    expect(db.category.upsert).not.toHaveBeenCalled(); expect(db.manufacturer.upsert).not.toHaveBeenCalled();
  });
  it('explicitly clears optional strings, manufacturer and age limits', async () => {
    await apply([{ sku: 'MED-EXISTING', brandName: '[CLEAR]', barcode: '[CLEAR]', manufacturerName: '[CLEAR]', minimumAgeYears: '[CLEAR]', maximumAgeYears: '[CLEAR]', storageInstructions: '[CLEAR]' }]);
    expect(db.product.update.mock.calls[0][0].data).toEqual({ brandName: null, barcode: null, manufacturerId: null, manufacturerName: null, minimumAgeYears: null, maximumAgeYears: null, storageInstructions: null });
  });
  it.each(['sku', 'sellingPrice', 'categoryName', 'unit', 'activeIngredient', 'active'])('rejects clearing required/identity field %s', (key) => {
    expect(parseBulkRow({ sku: 'MED-EXISTING', [key]: '[CLEAR]' }).errors.join()).toContain('cannot be cleared');
  });
  it('zero and false are deliberate values, not keep-existing markers', async () => {
    await apply([{ sku: 'MED-EXISTING', sellingPrice: '0', prescriptionRequired: 'No', minimumAgeYears: 0 }]);
    expect(db.product.update.mock.calls[0][0].data).toMatchObject({ sellingPrice: 0, prescriptionRequired: false, minimumAgeYears: 0 });
  });
  it('validates the age range against the retained other age bound', async () => {
    const r = await buildBulkPlan(db, [{ sku: 'MED-EXISTING', minimumAgeYears: 100 }]); expect(r.summary.errors[0].errors.join()).toContain('Maximum age');
  });
  it('does not write anything for blank-only updates', async () => {
    const r = await apply([{ sku: 'MED-EXISTING', brandName: '', active: '' }]); expect(r.unchanged).toBe(1); expect(db.product.update).not.toHaveBeenCalled();
  });
  it('creates normal medicine and retail samples without reactivating parents', async () => {
    db.product.findMany.mockResolvedValue([]); await apply(productTemplateRows);
    expect(db.product.create).toHaveBeenCalledTimes(2);
    expect(db.product.create.mock.calls[1][0].data).toMatchObject({ strength: 'N/A', dosageForm: 'Retail item', prescriptionRequired: false });
    expect(db.category.upsert.mock.calls.every(([q]) => Object.keys(q.update).length === 0)).toBe(true);
  });
  it('rejects an incomplete new SKU, unknown headers and ambiguous aliases', async () => {
    const r = await buildBulkPlan(db, [{ sku: 'NEW-SKU', mystery: 'x' }]); expect(r.summary.errors).toHaveLength(1);
    expect(parseBulkRow({ sku: 'AA', SKU: 'BB' }).errors.join()).toContain('Duplicate');
  });
  it.each([{ prescriptionRequired: 'typo' }, { pubchemCid: 'abc' }, { pubchemCid: -2 }, { pubchemCid: 1.5 }, { sellingPrice: '1e30' }, { sellingPrice: 1.001 }, { reorderLevel: 1.5 }])('rejects invalid cells %j', (patch) => {
    expect(parseBulkRow({ sku: 'AA', ...patch }).errors.length).toBeGreaterThan(0);
  });
  it('rejects missing medicine fields on create', async () => {
    db.product.findMany.mockResolvedValue([]);
    const r = await buildBulkPlan(db, [{ ...productTemplateRows[0], strength: '', dosageForm: '' }]); expect(r.summary.errors[0].errors.join()).toContain('Strength');
  });
  it('rejects duplicate keys on both rows and existing barcode conflicts', async () => {
    const r = await buildBulkPlan(db, [{ sku: 'MED-EXISTING' }, { sku: 'med-existing' }]); expect(r.summary.errors).toHaveLength(2);
    const b = await buildBulkPlan(db, [{ ...productTemplateRows[0], sku: 'NEW', barcode: '00001234' }]); expect(b.summary.errors[0].errors.join()).toContain('already belongs');
  });
  it.each(['unit', 'genericName', 'activeIngredient', 'strength', 'dosageForm'])('blocks changing %s for products with history', async (key) => {
    const r = await buildBulkPlan(db, [{ sku: 'MED-EXISTING', [key]: 'changed' }]); expect(r.summary.errors[0].errors.join()).toContain('history exists');
  });
  it('requires validation, rejects changed files and changed product versions', async () => {
    await expect(productBulkService.run([], false, { userId: 10 })).rejects.toThrow('Validate');
    const rows = [{ sku: 'MED-EXISTING', sellingPrice: 20 }]; const p = await productBulkService.run(rows, true);
    await expect(productBulkService.run([{ ...rows[0], sellingPrice: 30 }], false, { previewToken: p.previewToken, userId: 10 })).rejects.toThrow('changed');
    db.product.findMany.mockResolvedValue([{ ...current(), updatedAt: new Date() }]);
    await expect(productBulkService.run(rows, false, { previewToken: p.previewToken, userId: 10 })).rejects.toThrow('changed');
    expect(db.product.update).not.toHaveBeenCalled();
  });
  it('records before/after history within the apply transaction and safely replays a retry', async () => {
    const rows = [{ sku: 'MED-EXISTING', sellingPrice: 20 }]; const p = await productBulkService.run(rows, true);
    const result = await productBulkService.run(rows, false, { previewToken: p.previewToken, userId: 10 });
    expect(db.auditLog.findFirst).toHaveBeenCalledWith({ where: { userId: 10, action: 'PRODUCT_BULK_APPLIED', details: { path: '$.previewToken', equals: p.previewToken } } });
    expect(db.auditLog.create.mock.calls[0][0].data.details.changes).toContainEqual({ field: 'sellingPrice', label: 'Selling price (Rs.)', before: 12.5, after: 20 });
    const batch = db.auditLog.create.mock.calls.at(-1)[0].data;
    db.auditLog.findFirst.mockResolvedValue(batch);
    const retry = await productBulkService.run(rows, false, { previewToken: p.previewToken, userId: 10 });
    expect(retry).toMatchObject({ ...result, replayed: true }); expect(db.product.update).toHaveBeenCalledTimes(1);
  });
  it('does not hide an audit write failure', async () => {
    db.auditLog.create.mockRejectedValue(new Error('audit unavailable'));
    await expect(apply([{ sku: 'MED-EXISTING', sellingPrice: 20 }])).rejects.toThrow('audit unavailable');
  });
});

describe('CSV parsing and exports', () => {
  it.each(['sku,name\nAA,"unclosed', 'sku,sku\nAA,BB', 'sku,\nAA,BB', 'sku,name\nAA,BB,CC', 'sku,name\nAA', 'sku,name\nAA,"BB"CC'])('rejects malformed CSV %s', (input) => expect(() => parseCsv(input)).toThrow());
  it('supports BOM, commas, quotes and multiline cells', () => expect(parseCsv('\uFEFFSKU,Brand name\r\nAA,"one, ""two""\nthree"')).toEqual([{ SKU: 'AA', 'Brand name': 'one, "two"\nthree' }]));
  it('exports friendly headers that round-trip without clearing optional fields', async () => {
    const rows = parseCsv(toCsv(productBulkFields, [productUpdateRow(current())]));
    const p = await buildBulkPlan(db, rows); expect(p.summary.errors).toEqual([]); expect(p.summary.unchanged).toBe(1);
  });
  it('keeps negative numbers numeric and protects formula/control-prefixed text', () => {
    const out = toCsv([{ key: 'value', label: 'Value' }], [{ value: -2 }, { value: new Prisma.Decimal('-2.35') }, { value: '=1+1' }, { value: '\t=1+1' }]);
    expect(out).toContain('"-2"'); expect(out).toContain('"-2.35"'); expect(out).toContain('"\'=1+1"'); expect(out).toContain('"\'\t=1+1"');
  });
  it('keeps typed negative report amounts numeric without allowing expressions', () => {
    const out = toCsv([{ key: 'amount', label: 'Amount', numeric: true }], [{ amount: '-12.50' }, { amount: '-20.00%' }, { amount: '-1+2' }]);
    expect(out).toContain('"-12.50"'); expect(out).toContain('"-20.00%"'); expect(out).toContain('"\'-1+2"');
  });
  it.each(['=not-a-formula', "'Brand", '[CLEAR]', '+Brand', '-Brand'])('round-trips escaped optional text %s', async (brandName) => {
    const product = { ...current(), brandName }; db.product.findMany.mockResolvedValue([product]);
    const plan = await buildBulkPlan(db, parseCsv(toCsv(productBulkFields, [productUpdateRow(product)])));
    expect(plan.summary.errors).toEqual([]); expect(plan.summary.unchanged).toBe(1);
  });
  it('separates physical, reserved and unusable stock', () => {
    const r = stockExportTotals([{ quantityAvailable: 10, quantityReserved: 10, restricted: true, expiryDate: new Date('2020-01-01') }, { quantityAvailable: 20, quantityReserved: 3, restricted: false, expiryDate: new Date('2099-01-01') }]);
    expect(r.stockOnHand.toString()).toBe('30'); expect(r.stockAvailable.toString()).toBe('17'); expect(r.stockReserved.toString()).toBe('13');
  });
  it('exports beyond 5000 records in stable bounded pages', async () => {
    const model = { findFirst: vi.fn().mockResolvedValue({ id: 5501 }), findMany: vi.fn(async (q) => Array.from({ length: Math.min(q.take, 5501 - q.where.AND[1].id.gt) }, (_, i) => ({ id: q.where.AND[1].id.gt + i + 1 }))) };
    const ids = []; for await (const page of exportPages(model)) ids.push(...page.map((r) => r.id));
    expect(ids).toHaveLength(5501); expect(new Set(ids).size).toBe(5501); expect(model.findMany).toHaveBeenCalledTimes(12);
  });
});
