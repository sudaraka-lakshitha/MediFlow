// Local MySQL verification. Every fixture is rolled back, including the 2,000-row job.
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { prisma } from '../src/config/prisma.js';
import { productBulkService } from '../src/services/productBulk.service.js';
import { productTemplateRows } from '../src/utils/productBulkFormat.js';

const configured = new URL(process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL);
assert(['localhost', '127.0.0.1', '[::1]'].includes(configured.hostname), 'This diagnostic only permits local MySQL.');
const original = prisma.$transaction.bind(prisma);
const delegates = Object.fromEntries(Object.keys(prisma).filter((k) => !k.startsWith('_') && !k.startsWith('$') && typeof prisma[k]?.findMany === 'function').map((k) => [k, prisma[k]]));
const marker = `BULK-QA-${Date.now()}`;
const admin = await prisma.user.findFirst({ where: { role: 'ADMIN', active: true }, select: { id: true } });
assert(admin, 'A local administrator is required.');
const rollback = new Error('EXPECTED_QA_ROLLBACK');
let completed = 0;
const restore = () => { prisma.$transaction = original; for (const [k, value] of Object.entries(delegates)) prisma[k] = value; };
async function isolated(label, fn) {
  const start = performance.now();
  try {
    await original(async (tx) => {
      prisma.$transaction = (operation) => operation(tx);
      for (const key of Object.keys(delegates)) prisma[key] = tx[key];
      await fn(tx); throw rollback;
    }, { timeout: 180000 });
  } catch (error) { if (error !== rollback) throw error; }
  finally { restore(); }
  console.log(`PASS ${label} (${((performance.now() - start) / 1000).toFixed(2)} s, rolled back)`); completed++;
}
try {
  await isolated('Preserve, clear, stale validation, audit and idempotent retry', async (tx) => {
    const category = await tx.category.create({ data: { name: `${marker}-category`, active: false } });
    const maker = await tx.manufacturer.create({ data: { name: `${marker}-maker`, active: false } });
    const p = await tx.product.create({ data: { sku: marker, productType: 'MEDICINE', genericName: 'Temporary QA product', strength: '5 mg', dosageForm: 'Tablet', unit: 'tablet', activeIngredient: 'QA ingredient', sellingPrice: 12.5, reorderLevel: 10, active: false, prescriptionRequired: true, minimumAgeYears: 12, maximumAgeYears: 80, brandName: 'Keep brand', storageInstructions: 'Keep storage', categoryId: category.id, manufacturerId: maker.id } });
    const rows = [{ SKU: marker, 'Selling price (Rs.)': '25.00', 'Brand name': '', 'Minimum age (years)': '' }];
    const preview = await productBulkService.run(rows, true); assert.equal(preview.errors.length, 0);
    const applied = await productBulkService.run(rows, false, { userId: admin.id, previewToken: preview.previewToken, fileName: 'qa.csv' });
    assert(applied.applied);
    let after = await tx.product.findUnique({ where: { id: p.id } });
    assert.equal(Number(after.sellingPrice), 25); assert.equal(after.minimumAgeYears, 12); assert.equal(after.brandName, 'Keep brand'); assert.equal(after.active, false);
    assert.equal((await tx.category.findUnique({ where: { id: category.id } })).active, false);
    const retry = await productBulkService.run(rows, false, { userId: admin.id, previewToken: preview.previewToken }); assert(retry.replayed);
    const clear = [{ sku: marker, brandName: '[CLEAR]', manufacturerName: '[CLEAR]', minimumAgeYears: '[CLEAR]', storageInstructions: '[CLEAR]' }];
    const beforeClear = await productBulkService.run(clear, true); assert.equal(beforeClear.errors.length, 0);
    await productBulkService.run(clear, false, { userId: admin.id, previewToken: beforeClear.previewToken });
    after = await tx.product.findUnique({ where: { id: p.id } });
    assert.equal(after.brandName, null); assert.equal(after.minimumAgeYears, null); assert.equal(after.maximumAgeYears, 80); assert.equal(after.manufacturerId, null);
    const logged = await tx.auditLog.findMany({ where: { entityType: 'PRODUCT', entityId: p.id, action: 'PRODUCT_BULK_UPDATED' } });
    assert.equal(logged.length, 2); assert.equal(logged[0].details.before.brandName, 'Keep brand');
    const stale = await productBulkService.run(rows, true);
    await tx.product.update({ where: { id: p.id }, data: { sellingPrice: 27 } });
    await assert.rejects(productBulkService.run(rows, false, { userId: admin.id, previewToken: stale.previewToken }), /changed/);
    await tx.inventoryBatch.create({ data: { productId: p.id, batchNumber: marker, quantityReceived: 10, quantityAvailable: 10, purchasePrice: 1, expiryDate: new Date('2030-01-01') } });
    const invalid = await productBulkService.run([{ sku: marker, unit: 'ml' }], true); assert(invalid.errors.length);
  });
  await isolated('Maximum 2,000-row import and complete audit coverage', async (tx) => {
    const rows = Array.from({ length: 2000 }, (_, i) => ({ ...productTemplateRows[1], sku: `${marker}-${i}`, categoryName: `${marker}-bulk-category` }));
    const preview = await productBulkService.run(rows, true); assert.equal(preview.creates, 2000); assert.equal(preview.errors.length, 0);
    const applied = await productBulkService.run(rows, false, { userId: admin.id, previewToken: preview.previewToken });
    assert.equal(applied.creates, 2000);
    assert.equal(await tx.product.count({ where: { sku: { startsWith: marker } } }), 2000);
    assert.equal(await tx.auditLog.count({ where: { action: 'PRODUCT_BULK_CREATED', details: { path: '$.batchId', equals: applied.batchId } } }), 2000);
  });
  const rows = [{ ...productTemplateRows[1], sku: `${marker}-fail`, categoryName: `${marker}-fail-category` }];
  const preview = await productBulkService.run(rows, true);
  prisma.$transaction = (operation, options) => original((tx) => operation(new Proxy(tx, { get(target, key) { if (key === 'auditLog') return { ...target.auditLog, create: async () => { throw new Error('INTENTIONAL_AUDIT_FAILURE'); } }; return target[key]; } })), options);
  await assert.rejects(productBulkService.run(rows, false, { userId: admin.id, previewToken: preview.previewToken }), /INTENTIONAL_AUDIT_FAILURE/);
  restore();
  assert.equal(await prisma.product.count({ where: { sku: { startsWith: marker } } }), 0);
  assert.equal(await prisma.category.count({ where: { name: { startsWith: marker } } }), 0);
  assert.equal(await prisma.manufacturer.count({ where: { name: { startsWith: marker } } }), 0);
  console.log('PASS Audit failure rolls back the entire import; no fixtures remain.'); completed++;
  console.log(`${completed} database scenario groups passed.`);
} finally { restore(); await prisma.$disconnect(); }
