import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { normalizeDrugName } from '../utils/drug.js';
import { productSchema } from '../validators/catalog.validator.js';
import { CLEAR_VALUE, productBulkFields } from '../utils/productBulkFormat.js';

const text = (max) => z.string().trim().min(1).max(max);
const number = (max, integer = false) => z.preprocess((v) => typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? Number(v) : v,
  integer ? z.number().int().min(0).max(max) : z.number().min(0).max(max).multipleOf(0.01));
const boolean = z.preprocess((v) => typeof v === 'string' && /^(true|yes|1|false|no|0)$/i.test(v)
  ? /^(true|yes|1)$/i.test(v) : v, z.boolean());
const fields = {
  sku: text(40).min(2), productType: z.enum(['MEDICINE', 'NON_MEDICINAL']), genericName: text(150).min(2),
  strength: text(80), dosageForm: text(80), unit: text(40), categoryName: text(100).min(2),
  sellingPrice: number(9999999999.99), reorderLevel: number(2147483647, true), prescriptionRequired: boolean, active: boolean,
  brandName: text(150), activeIngredient: text(180), manufacturerName: text(150), barcode: text(80), variantGroup: text(100),
  storageInstructions: text(300), minimumAgeYears: number(130, true), maximumAgeYears: number(130, true),
  rxNormCui: text(30), pubchemCid: number(2147483647, true).refine((v) => v > 0, 'Must be a positive whole number.'), smiles: text(2000),
};
const fieldByKey = new Map(productBulkFields.map((f) => [f.key, f]));
const aliases = new Map(productBulkFields.flatMap((f) => [[f.key.toLowerCase(), f.key], [f.label.toLowerCase(), f.key]]));
const identityFields = ['productType', 'genericName', 'activeIngredient', 'strength', 'dosageForm', 'unit'];
export const productHistoryInclude = { _count: { select: { batches: true, prescriptionItems: true, prescriptionRetailItems: true, saleItems: true, paymentRequestItems: true, stockMovements: true } } };
const keyOf = (v) => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const same = (a, b) => String(a ?? '') === String(b ?? '');
const hash = (data) => createHash('sha256').update(JSON.stringify(data)).digest('hex');
const hasHistory = (p) => Object.values(p?._count || {}).some((count) => count > 0);
export const assertProductIdentity = (existing, next) => {
  const changed = identityFields.filter((key) => Object.hasOwn(next, key) && !same(existing[key], next[key]));
  if (changed.length && hasHistory(existing)) throw new AppError(409, `Stock or order history exists. Create a new SKU instead of changing: ${changed.join(', ')}.`);
};
const snapshot = (p) => p ? Object.fromEntries(productBulkFields.map(({ key }) => [key,
  key === 'categoryName' ? p.category?.name : key === 'manufacturerName' ? p.manufacturer?.name || p.manufacturerName || null
    : key === 'sellingPrice' ? Number(p[key]) : p[key] ?? null])) : null;

export const parseBulkRow = (row) => {
  const patch = {}; const errors = []; const seen = new Set();
  for (const [header, raw] of Object.entries(row)) {
    const key = aliases.get(header.trim().toLowerCase());
    if (!key) { errors.push(`Unknown column "${header}". Use the latest template or export for update.`); continue; }
    if (seen.has(key)) { errors.push(`Duplicate column for ${key}.`); continue; }
    seen.add(key);
    let value = typeof raw === 'string' ? raw.trim() : raw;
    const literal = typeof value === 'string' && /^'(?:'|\[CLEAR\]$|[\s\u0000-\u001f]*[=+\-@]|[\t\r\n])/.test(value);
    if (literal) value = value.slice(1);
    // Absence, null and empty cells are all keep-existing, never delete.
    if (value == null || value === '') continue;
    if (value === CLEAR_VALUE && !literal) {
      if (!fieldByKey.get(key).clearable) errors.push(`${key}: this field cannot be cleared.`);
      else patch[key] = null;
      continue;
    }
    const parsed = fields[key].safeParse(value);
    if (parsed.success) patch[key] = parsed.data;
    else errors.push(`${key}: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
  }
  if (!patch.sku) errors.push('sku: enter the SKU of the product to create or update.');
  return { patch, errors };
};

export const buildBulkPlan = async (db, rows) => {
  const entries = rows.map((row, index) => ({ row: index + 2, ...parseBulkRow(row) }));
  const skus = entries.map((e) => e.patch.sku).filter(Boolean);
  const barcodes = entries.map((e) => e.patch.barcode).filter(Boolean);
  const products = await db.product.findMany({ where: { OR: [{ sku: { in: skus } }, { barcode: { in: barcodes } }] },
    include: { category: true, manufacturer: true, ...productHistoryInclude } });
  const bySku = new Map(products.map((p) => [keyOf(p.sku), p]));
  const byBarcode = new Map(products.filter((p) => p.barcode).map((p) => [keyOf(p.barcode), p]));
  const seenSku = new Map(); const seenBarcode = new Map();
  const plans = [];
  for (const entry of entries) {
    const { patch, errors } = entry;
    for (const [key, seen] of [['sku', seenSku], ['barcode', seenBarcode]]) {
      if (!patch[key]) continue;
      const normalized = keyOf(patch[key]);
      if (seen.has(normalized)) {
        const prior = seen.get(normalized);
        errors.push(`${key}: duplicates row ${prior.row}.`);
        prior.errors.push(`${key}: duplicates row ${entry.row}.`);
      } else seen.set(normalized, entry);
    }
    const existing = bySku.get(keyOf(patch.sku));
    const before = snapshot(existing);
    const next = { ...(before || { productType: 'MEDICINE', reorderLevel: 0, active: true }), ...patch };
    if (existing) next.sku = existing.sku;
    if (!existing) {
      next.prescriptionRequired ??= next.productType === 'MEDICINE';
      if (next.productType === 'NON_MEDICINAL') { next.strength ||= 'N/A'; next.dosageForm ||= 'Retail item'; }
      else next.activeIngredient ||= next.genericName;
    }
    if (next.unit) next.unit = next.unit.toLowerCase();
    if (existing && patch.productType && patch.productType !== existing.productType && next.productType === 'NON_MEDICINAL') {
      errors.push('productType: create a new retail SKU instead of converting a medicine.');
    }
    if (!next.categoryName) errors.push('categoryName: required for a new product.');
    const validated = productSchema.safeParse({ ...next, categoryId: existing?.categoryId || 1,
      manufacturerId: existing?.manufacturerId || null });
    if (!validated.success) errors.push(...validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
    if (existing) {
      try { assertProductIdentity(existing, next); } catch (error) { errors.push(error.message); }
    }
    const owner = patch.barcode && byBarcode.get(keyOf(patch.barcode));
    if (owner && owner.id !== existing?.id) errors.push(`barcode: already belongs to SKU ${owner.sku}. Clear it there in a separate import before reusing it.`);
    const changes = productBulkFields.filter(({ key }) => !same(before?.[key], next[key])).map(({ key, label }) => ({ field: key, label, before: before?.[key] ?? null, after: next[key] ?? null }));
    plans.push({ ...entry, existing, before, next, changes });
  }
  // Duplicate messages are attached to the shared entry errors during the full pass.
  const errors = plans.filter((p) => p.errors.length).map((p) => ({ row: p.row, sku: p.patch.sku || '', errors: [...new Set(p.errors)] }));
  const summary = { total: rows.length, valid: rows.length - errors.length,
    creates: plans.filter((p) => !p.errors.length && !p.existing).length,
    updates: plans.filter((p) => !p.errors.length && p.existing && p.changes.length).length,
    unchanged: plans.filter((p) => !p.errors.length && p.existing && !p.changes.length).length,
    errors, preview: plans.filter((p) => !p.errors.length).map((p) => ({ row: p.row, sku: p.next.sku, action: !p.existing ? 'Create' : p.changes.length ? 'Update' : 'Unchanged', changes: p.changes })) };
  const previewToken = hash({ rows, state: products.map((p) => ({ ...snapshot(p), id: p.id, updatedAt: p.updatedAt, history: p._count })).sort((a, b) => a.id - b.id) });
  return { plans, summary, previewToken };
};

const applyPlan = async (tx, plan) => {
  const { next, existing, patch } = plan;
  const data = {};
  const keys = existing ? Object.keys(patch) : productBulkFields.map((f) => f.key);
  for (const key of keys) {
    if (['sku', 'categoryName', 'manufacturerName'].includes(key)) continue;
    if (next[key] !== undefined) data[key] = next[key];
  }
  if (!existing) data.sku = next.sku;
  if (!existing || Object.hasOwn(patch, 'categoryName')) {
    const category = await tx.category.upsert({ where: { name: next.categoryName }, update: {}, create: { name: next.categoryName } });
    data.categoryId = category.id;
  }
  if (!existing || Object.hasOwn(patch, 'manufacturerName')) {
    const manufacturer = next.manufacturerName ? await tx.manufacturer.upsert({ where: { name: next.manufacturerName }, update: {}, create: { name: next.manufacturerName } }) : null;
    data.manufacturerId = manufacturer?.id || null;
    data.manufacturerName = null;
  }
  if (next.productType === 'MEDICINE' && (!existing || Object.hasOwn(patch, 'activeIngredient') || Object.hasOwn(patch, 'productType'))) {
    const ingredient = next.activeIngredient || next.genericName;
    const concept = await tx.drugConcept.upsert({ where: { normalizedName: normalizeDrugName(ingredient) }, update: {}, create: { normalizedName: normalizeDrugName(ingredient), displayName: ingredient } });
    data.activeIngredient = ingredient; data.drugConceptId = concept.id;
  }
  return existing ? tx.product.update({ where: { id: existing.id }, data }) : tx.product.create({ data });
};

export const productBulkService = {
  async run(rows, dryRun, { previewToken, userId, ipAddress, fileName } = {}) {
    if (dryRun) {
      const { summary, previewToken: token } = await buildBulkPlan(prisma, rows);
      return { ...summary, applied: false, previewToken: summary.errors.length ? null : token };
    }
    if (!previewToken) throw new AppError(400, 'Validate this file and review the changes before applying.');
    if (!userId) throw new AppError(403, 'An authenticated administrator is required.');
    const inputHash = hash(rows);
    try {
      return await prisma.$transaction(async (tx) => {
        const prior = await tx.auditLog.findFirst({ where: { userId, action: 'PRODUCT_BULK_APPLIED', details: { path: '$.previewToken', equals: previewToken } } });
        if (prior?.details?.inputHash === inputHash) return { ...prior.details.result, replayed: true };
        const { plans, summary, previewToken: currentToken } = await buildBulkPlan(tx, rows);
        if (summary.errors.length) throw new AppError(400, 'Correct every invalid row and validate again.', summary);
        if (currentToken !== previewToken) throw new AppError(409, 'The file or saved products changed since validation. Validate again before applying.');
        const batchId = randomUUID();
        for (const plan of plans) {
          if (plan.existing && !plan.changes.length) continue;
          const product = await applyPlan(tx, plan);
          await tx.lowStockAcknowledgement.deleteMany({ where: { productId: product.id } });
          await tx.auditLog.create({ data: { userId, action: plan.existing ? 'PRODUCT_BULK_UPDATED' : 'PRODUCT_BULK_CREATED', entityType: 'PRODUCT', entityId: product.id, ipAddress,
            details: { batchId, row: plan.row, sku: product.sku, changes: plan.changes, before: plan.before, after: snapshot({ ...product, category: { name: plan.next.categoryName }, manufacturer: { name: plan.next.manufacturerName } }) } } });
        }
        const { preview, ...counts } = summary;
        const result = { ...counts, applied: true, batchId };
        await tx.auditLog.create({ data: { userId, action: 'PRODUCT_BULK_APPLIED', entityType: 'PRODUCT_IMPORT', ipAddress,
          details: { batchId, previewToken, inputHash, fileName: fileName || null, result } } });
        return result;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 10000, timeout: 120000 });
    } catch (error) {
      if (['P2002', 'P2034', 'P2028'].includes(error.code)) throw new AppError(409, 'The import could not be completed. No partial changes were saved. Validate again, or use a smaller file if it timed out.');
      throw error;
    }
  },
};
