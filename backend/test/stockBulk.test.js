import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import { stockBulkPlan, stockBulkService } from '../src/services/stockBulk.service.js';
import { exportStockWorkbook, readStockWorkbook } from '../src/services/stockWorkbook.service.js';
import { readProductWorkbook } from '../src/services/productWorkbook.service.js';

const { db } = vi.hoisted(() => ({ db: {
  product: { findMany: vi.fn() }, supplier: { findMany: vi.fn() },
  inventoryBatch: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() },
  stockMovement: { create: vi.fn() }, auditLog: { create: vi.fn() },
  lowStockAcknowledgement: { deleteMany: vi.fn() },
  operationReceipt: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() }, $transaction: vi.fn(),
} }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
let batch;
const row = (patch = {}) => ({ sku: 'DEMO-1', batch_number: 'B001', action: 'ADJUST', quantity: '5', ...patch });
beforeEach(() => {
  vi.resetAllMocks();
  batch = { id: 2, productId: 1, batchNumber: 'B001', quantityAvailable: new Prisma.Decimal(25), quantityReceived: new Prisma.Decimal(25), quantityReserved: new Prisma.Decimal(5), purchasePrice: new Prisma.Decimal(10), expiryDate: new Date('2099-12-31T00:00:00Z'), supplierId: 3, supplier: { id: 3, name: 'Demo Supplier' }, restricted: false };
  db.product.findMany.mockResolvedValue([{ id: 1, sku: 'DEMO-1', genericName: 'Demo medicine', unit: 'tablet', active: true }]);
  db.supplier.findMany.mockResolvedValue([{ id: 3, name: 'Demo Supplier', active: true }, { id: 4, name: 'Inactive Supplier', active: false }]);
  db.inventoryBatch.findUnique.mockImplementation(async () => batch);
  db.inventoryBatch.update.mockImplementation(async ({ data }) => { batch = { ...batch, ...data }; return batch; });
  db.inventoryBatch.create.mockImplementation(async ({ data }) => ({ id: 2, ...data }));
  const receipts = new Map();
  db.operationReceipt.findUnique.mockImplementation(async ({ where }) => receipts.get(where.actorId_key.key));
  db.operationReceipt.create.mockImplementation(async ({ data }) => receipts.set(data.key, data));
  db.operationReceipt.update.mockImplementation(async ({ where, data }) => receipts.set(where.actorId_key.key, { ...receipts.get(where.actorId_key.key), ...data }));
  db.$transaction.mockImplementation(async fn => {
    const oldReceipts = new Map(receipts), oldBatch = { ...batch };
    try { return await fn(db); } catch (error) { receipts.clear(); for (const [k, v] of oldReceipts) receipts.set(k, v); batch = oldBatch; throw error; }
  });
});
describe('bulk stock safeguards', () => {
  it('never inserts sample stock rows into an empty live export', async () => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await exportStockWorkbook([]));
    expect(wb.getWorksheet('Stock').getCell('A11').value).toBeNull();
  });
  it('an unchanged exported count is not a receipt or adjustment', async () => {
    const buffer = await exportStockWorkbook([{ sku: 'DEMO-1', batchNumber: 'B001', action: 'SET_COUNT', quantity: 25, expiryDate: '2099-12-31', purchasePrice: 10 }]);
    const rows = await readStockWorkbook(Buffer.from(buffer));
    const plan = await stockBulkPlan(db, rows);
    expect(plan.errors).toEqual([]); expect(plan.plans[0].quantityChange).toBe(0); expect(plan.summary.validUpdates).toBe(0);
  });
  it('applies a counted total as a difference and replays a confirm without changing stock twice', async () => {
    const rows = [row({ action: 'SET_COUNT', quantity: 30 })];
    const preview = await stockBulkService.preview(rows, { id: 10 });
    const first = await stockBulkService.apply(rows, preview.previewToken, { id: 10 });
    const replay = await stockBulkService.apply(rows, preview.previewToken, { id: 10 });
    expect(replay).toEqual(first); expect(Number(batch.quantityAvailable)).toBe(30);
    expect(db.stockMovement.create).toHaveBeenCalledTimes(1); expect(db.auditLog.create).toHaveBeenCalledTimes(1);
  });
  it('rejects a preview if reservations or stock changed in the meantime', async () => {
    const rows = [row()]; const p = await stockBulkService.preview(rows, { id: 10 });
    batch.quantityReserved = new Prisma.Decimal(6);
    await expect(stockBulkService.apply(rows, p.previewToken, { id: 10 })).rejects.toThrow('changed since preview');
    expect(db.inventoryBatch.update).not.toHaveBeenCalled();
  });
  it('prevents file changes or another user confirming the preview', async () => {
    const rows = [row()]; const p = await stockBulkService.preview(rows, { id: 10 });
    await expect(stockBulkService.apply([row({ quantity: 10 })], p.previewToken, { id: 10 })).rejects.toThrow('changed');
    await expect(stockBulkService.apply(rows, p.previewToken, { id: 11 })).rejects.toThrow('changed');
  });
  it.each(['Infinity', 'NaN', '0.5', '1000000000'])('rejects invalid tablet quantity %s', async quantity => {
    expect((await stockBulkPlan(db, [row({ quantity })])).errors).toHaveLength(1);
  });
  it('accepts three decimals for measured units but rejects excess precision', async () => {
    db.product.findMany.mockResolvedValue([{ id: 1, sku: 'DEMO-1', genericName: 'Liquid', unit: 'ml', active: true }]);
    expect((await stockBulkPlan(db, [row({ quantity: '1.125' })])).errors).toEqual([]);
    expect((await stockBulkPlan(db, [row({ quantity: '0.0001' })])).errors).toHaveLength(1);
  });
  it('blocks a physical count below reservations', async () => {
    expect((await stockBulkPlan(db, [row({ action: 'SET_COUNT', quantity: 4 })])).errors[0].message).toContain('reserved');
  });
  it('allows a zero count when nothing is reserved', async () => {
    batch.quantityReserved = 0;
    expect((await stockBulkPlan(db, [row({ action: 'SET_COUNT', quantity: 0 })])).plans[0].quantityAfter).toBe(0);
  });
  it('does not revive expired batches or receive into restricted batches', async () => {
    batch.expiryDate = new Date('2020-01-01T00:00:00Z');
    expect((await stockBulkPlan(db, [row({ expiry_date: '2099-12-31' })])).errors).toHaveLength(1);
    expect((await stockBulkPlan(db, [row({ quantity: -1, expiry_date: '2099-12-31' })])).errors).toHaveLength(1);
    batch.expiryDate = new Date('2099-12-31T00:00:00Z'); batch.restricted = true;
    expect((await stockBulkPlan(db, [row({ action: 'RECEIVE' })])).errors).toHaveLength(1);
  });
  it('keeps dates calendar based and rejects impossible dates', async () => {
    expect((await stockBulkPlan(db, [row({ expiry_date: '2099-12-30' })])).plans[0].expiryDate).toBe('2099-12-30');
    expect((await stockBulkPlan(db, [row({ expiry_date: '2099-02-31' })])).errors).toHaveLength(1);
  });
  it('preserves blanks, accepts zero cost, clears a supplier only explicitly', async () => {
    const keep = (await stockBulkPlan(db, [row({ purchase_price: '', supplier_name: '' })])).plans[0];
    expect(keep.purchasePrice).toBe(10); expect(keep.supplierId).toBe(3);
    const clear = (await stockBulkPlan(db, [row({ purchase_price: 0, supplier_name: '[CLEAR]' })])).plans[0];
    expect(clear.purchasePrice).toBe(0); expect(clear.supplierId).toBeNull();
  });
  it.each(['Demo', 'Inactive Supplier'])('rejects nonexact or inactive supplier %s', async supplier_name => {
    expect((await stockBulkPlan(db, [row({ supplier_name })])).errors).toHaveLength(1);
  });
  it.each(['Infinity', '-1', '1.001'])('rejects invalid cost %s', async purchase_price => {
    expect((await stockBulkPlan(db, [row({ purchase_price })])).errors).toHaveLength(1);
  });
  it('requires explicit cost and a future date for new batches', async () => {
    db.inventoryBatch.findUnique.mockResolvedValue(null);
    expect((await stockBulkPlan(db, [row({ action: 'RECEIVE', expiry_date: '2099-12-31' })])).errors).toHaveLength(1);
    expect((await stockBulkPlan(db, [row({ action: 'RECEIVE', expiry_date: '2099-12-31', purchase_price: 0 })])).errors).toEqual([]);
  });
  it.each(['Stock', 'Products'])('rejects cached formula results in %s uploads', async name => {
    const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet(name);
    ws.addRow(name === 'Stock' ? ['sku', 'batch_number', 'quantity'] : ['sku', 'sellingPrice']);
    ws.addRow(name === 'Stock' ? ['DEMO-1', 'B001', { formula: '1+1', result: -100 }] : ['DEMO-1', { formula: '1+1', result: -100 }]);
    const buffer = Buffer.from(await wb.xlsx.writeBuffer());
    await expect((name === 'Stock' ? readStockWorkbook : readProductWorkbook)(buffer)).rejects.toThrow('plain values');
  });
});
