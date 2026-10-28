import { createHash, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { chunkedTransaction } from '../utils/chunkedTransaction.js';
import { operationContext } from '../utils/operationContext.js';
import { calendarDate } from '../validators/calendar.js';
import { moneySchema } from '../validators/money.js';
import { CLEAR_VALUE } from '../utils/productBulkFormat.js';

const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const dateText = value => value ? new Date(value).toISOString().slice(0, 10) : null;
const todayText = () => new Date(Date.now() + env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
const number = value => Number(value ?? 0);
const unescapeCell = value => typeof value === 'string' && /^'(?:'|\[CLEAR\]$|[=+\-@])/.test(value) ? value.slice(1) : value;

export async function stockBulkPlan(tx, rows) {
  const products = await tx.product.findMany({ select: { id: true, sku: true, genericName: true, brandName: true, unit: true, active: true, barcode: true } });
  const suppliers = await tx.supplier.findMany({ select: { id: true, name: true, active: true } });

  const canBatchLookup = typeof tx.inventoryBatch?.findMany === 'function';
  let batchMap = new Map();
  if (canBatchLookup) {
    const batchNumbers = [...new Set(rows.map(r => String(unescapeCell(r.batch_number || r.batch || '')).trim()).filter(Boolean))];
    if (batchNumbers.length) {
      const existingBatches = await tx.inventoryBatch.findMany({
        where: { batchNumber: { in: batchNumbers } },
        include: { supplier: true },
      });
      batchMap = new Map(existingBatches.map(b => [`${b.productId}:${b.batchNumber.toUpperCase()}`, b]));
    }
  }

  const plans = [], errors = [], seen = new Set();
  for (const [index, row] of rows.entries()) {
    const rowNum = number(row.__sourceRow || index + 2);
    const sku = String(unescapeCell(row.sku || row.product_code || '')).trim();
    const batchNumber = String(unescapeCell(row.batch_number || row.batch || '')).trim();
    const rawQty = String(unescapeCell(row.quantity ?? '')).trim();
    if (!sku && !batchNumber && !rawQty) continue;
    try {
      const fail = message => { throw new AppError(400, message); };
      if (!sku) fail('Product SKU / Code is required.');
      const matches = products.filter(p => p.sku.toUpperCase() === sku.toUpperCase() || p.barcode?.toUpperCase() === sku.toUpperCase());
      if (matches.length !== 1) fail('Product code is missing or ambiguous. Use its unique SKU.');
      const product = matches[0];
      if (!product.active) fail('This product is inactive.');
      if (!batchNumber || batchNumber.length > 80) fail('Enter a batch number of at most 80 characters.');
      const key = product.id + ':' + batchNumber.toUpperCase();
      if (seen.has(key)) fail('Duplicate product and batch in this upload.');
      seen.add(key);
      const inputAction = String(row.action || 'RECEIVE').trim().toUpperCase();
      const action = inputAction === 'RESTOCK' ? 'RECEIVE' : inputAction;
      if (!['RECEIVE', 'ADJUST', 'SET_COUNT'].includes(action)) fail('Choose RECEIVE, ADJUST (signed change), or SET_COUNT (counted total).');
      if (!rawQty) fail('Quantity is required.');
      const quantity = action === 'SET_COUNT' && /^0(?:\.0{1,3})?$/.test(rawQty)
        ? new Prisma.Decimal(0) : stockQuantity(rawQty, product.unit, { signed: action === 'ADJUST' });
      const batchLookupKey = `${product.id}:${batchNumber.toUpperCase()}`;
      const existing = canBatchLookup
        ? batchMap.get(batchLookupKey)
        : (typeof tx.inventoryBatch?.findUnique === 'function' ? await tx.inventoryBatch.findUnique({ where: { productId_batchNumber: { productId: product.id, batchNumber } }, include: { supplier: true } }) : null);
      if (!existing && action !== 'RECEIVE') fail('Batch not found. Use RECEIVE to add a new batch.');
      const before = new Prisma.Decimal(existing?.quantityAvailable ?? 0);
      const delta = action === 'SET_COUNT' ? quantity.sub(before) : quantity;
      const after = before.add(delta);
      if (after.isNegative() || after.greaterThan('999999999.999')) fail('Resulting stock is outside the supported range.');
      if (after.lessThan(existing?.quantityReserved ?? 0)) fail('Stock cannot be reduced below the quantity reserved for active orders.');
      if (existing && delta.isPositive() && (existing.restricted || dateText(existing.expiryDate) <= todayText())) fail('Cannot increase stock in a restricted or expired batch. Review the batch first.');
      if (action === 'RECEIVE' && new Prisma.Decimal(existing?.quantityReceived ?? 0).add(delta).greaterThan('999999999.999')) fail('Total received quantity exceeds the supported range.');

      const rawExpiry = String(row.expiry_date ?? '').trim();
      let expiryDate = dateText(existing?.expiryDate);
      if (rawExpiry) {
        if (!calendarDate.safeParse(rawExpiry).success) fail('Use a valid expiry date in YYYY-MM-DD format.');
        expiryDate = rawExpiry;
      }
      if (!expiryDate) fail('Expiry date is required for a new batch.');
      if (action === 'RECEIVE' && expiryDate <= todayText()) fail('Incoming stock must have a future expiry date.');
      if (existing && expiryDate !== dateText(existing.expiryDate)) {
        if (action === 'RECEIVE') fail('This batch already has a different expiry date. Check the batch identity.');
        if (dateText(existing.expiryDate) <= todayText()) fail('Expired batches cannot have their expiry extended. Use the expired-stock review.');
      }
      const rawCost = String(row.purchase_price ?? '').trim();
      if (!existing && !rawCost) fail('Purchase price is required for a new batch. Enter 0 explicitly for free stock.');
      const parsedCost = rawCost ? moneySchema.safeParse(rawCost) : null;
      if (parsedCost && !parsedCost.success) fail('Purchase price must be finite, nonnegative, within range and use at most two decimals.');
      const purchasePrice = parsedCost ? parsedCost.data : number(existing?.purchasePrice);
      const supplierInput = String(row.supplier_name ?? '').trim();
      const rawSupplier = unescapeCell(supplierInput);
      let supplierId = existing?.supplierId ?? null;
      let supplierName = existing?.supplier?.name ?? null;
      if (supplierInput === CLEAR_VALUE) { supplierId = null; supplierName = null; }
      else if (rawSupplier) {
        const matches = suppliers.filter(s => s.name.trim().toLowerCase() === rawSupplier.toLowerCase());
        if (matches.length !== 1 || !matches[0].active) fail('Supplier must match one active supplier exactly. Create it first or correct the name.');
        supplierId = matches[0].id; supplierName = matches[0].name;
      }
      const reason = String(unescapeCell(row.reason ?? '')).trim() || (action === 'RECEIVE' ? 'Bulk shipment receipt' : 'Bulk stock count adjustment');
      if (reason.length > 500) fail('Reason must be 500 characters or fewer.');
      const changes = [];
      const change = (field, label, oldValue, newValue) => { if (oldValue !== newValue) changes.push({ field, label, before: oldValue, after: newValue }); };
      change('quantity', 'Available stock', number(before), number(after));
      change('purchasePrice', 'Purchase price', existing ? number(existing.purchasePrice) : null, purchasePrice);
      change('expiryDate', 'Expiry date', dateText(existing?.expiryDate), expiryDate);
      change('supplier', 'Supplier', existing?.supplier?.name ?? null, supplierName);
      plans.push({ row: rowNum, productId: product.id, productCode: product.sku, productName: product.brandName ? product.genericName + ' (' + product.brandName + ')' : product.genericName,
        unit: product.unit, batchNumber, action, existingBatchId: existing?.id ?? null,
        quantityBefore: number(before), quantityChange: number(delta), quantityAfter: number(after),
        purchasePrice, expiryDate, supplierId, supplierName, reason, changes,
        // Bind relevant database inputs, including holds and restrictions, to the approved preview.
        snapshot: existing ? { quantityReceived: number(existing.quantityReceived), quantityReserved: number(existing.quantityReserved), restricted: Boolean(existing.restricted), expiryDate: dateText(existing.expiryDate), purchasePrice: number(existing.purchasePrice), supplierId: existing.supplierId ?? null } : null,
      });
    } catch (error) {
      if (!(error instanceof AppError)) throw error;
      errors.push({ row: rowNum, sku: sku || 'N/A', message: error.message });
    }
  }
  return { plans, errors, summary: { totalRows: rows.length, validUpdates: plans.filter(p => p.changes.length).length,
    receives: plans.filter(p => p.action === 'RECEIVE' && p.changes.length).length,
    adjusts: plans.filter(p => p.action !== 'RECEIVE' && p.changes.length).length, errorsCount: errors.length } };
}

export const stockBulkService = {
  async preview(rows, user) {
    const result = await stockBulkPlan(prisma, rows);
    const previewToken = result.errors.length || !result.summary.validUpdates ? null : jwt.sign(
      { purpose: 'stock-bulk', userId: user.id, digest: digest(rows), planDigest: digest(result.plans) },
      env.JWT_SECRET, { expiresIn: '15m', jwtid: randomUUID() });
    return { ...result, previewToken };
  },
  async apply(rows, previewToken, user) {
    if (!previewToken) throw new AppError(400, 'Preview token is required.');
    let claim;
    try { claim = jwt.verify(previewToken, env.JWT_SECRET); }
    catch { throw new AppError(409, 'Preview expired or invalid. Please re-validate the file.'); }
    if (claim.purpose !== 'stock-bulk' || claim.userId !== user.id || claim.digest !== digest(rows) || !claim.planDigest || !/^[0-9a-f-]{36}$/i.test(claim.jti || '')) throw new AppError(409, 'File or user changed. Re-validate the file.');

    return operationContext.run({ actorId: user.id, key: claim.jti, hash: digest({ purpose: 'stock-bulk', rows }) }, async () => {
      const context = operationContext.getStore();
      const where = { actorId_key: { actorId: context.actorId, key: context.key } };
      const existing = await prisma.operationReceipt.findUnique({ where });
      if (existing) {
        if (existing.payloadHash !== context.hash) throw new AppError(409, 'This retry key belongs to a different operation. Refresh and review the form.');
        return existing.result;
      }

      // Phase 1 — validate the full plan against the current DB state (no locks)
      const { plans, errors } = await stockBulkPlan(prisma, rows);
      if (errors.length) throw new AppError(422, errors.map(e => 'Row ' + e.row + ': ' + e.message).join('; '));
      if (digest(plans) !== claim.planDigest) throw new AppError(409, 'Stock or batch details changed since preview. Re-validate and review the updated result.');
      const changed = plans.filter(p => p.changes.length);
      if (!changed.length) throw new AppError(400, 'There are no changes to apply.');

      await prisma.operationReceipt.create({ data: { actorId: context.actorId, key: context.key, payloadHash: context.hash, result: {} } });

      // Phase 2 — apply in small transactional chunks to stay under gateway timeouts
      await chunkedTransaction({
        items: changed,
        chunkSize: 15,
        timeout: 35000,
        async process(tx, chunk) {
          const movements = [];
          for (const plan of chunk) {
            const data = { quantityAvailable: new Prisma.Decimal(plan.quantityAfter), purchasePrice: new Prisma.Decimal(plan.purchasePrice), expiryDate: new Date(plan.expiryDate + 'T00:00:00.000Z'), supplierId: plan.supplierId };
            const batch = plan.existingBatchId ? await tx.inventoryBatch.update({ where: { id: plan.existingBatchId }, data: { ...data, ...(plan.action === 'RECEIVE' ? { quantityReceived: { increment: new Prisma.Decimal(plan.quantityChange) } } : {}) } })
              : await tx.inventoryBatch.create({ data: { ...data, productId: plan.productId, batchNumber: plan.batchNumber, quantityReceived: new Prisma.Decimal(plan.quantityChange) } });
            if (plan.quantityChange !== 0) {
              const mov = { productId: plan.productId, batchId: batch.id, type: plan.action === 'RECEIVE' ? 'RECEIPT' : 'ADJUSTMENT', quantityChange: new Prisma.Decimal(plan.quantityChange), quantityBefore: new Prisma.Decimal(plan.quantityBefore), quantityAfter: new Prisma.Decimal(plan.quantityAfter), reason: plan.reason, performedById: user.id };
              if (typeof tx.stockMovement?.createMany === 'function') {
                movements.push(mov);
              } else {
                await tx.stockMovement.create({ data: mov });
              }
            }
          }
          if (movements.length > 0) {
            await tx.stockMovement.createMany({ data: movements });
          }
          await tx.lowStockAcknowledgement.deleteMany({ where: { productId: { in: [...new Set(chunk.map(p => p.productId))] } } });
        },
      });

      // Phase 3 — record the overall audit log and update operation receipt
      const result = { applied: true, batchesUpdated: changed.length, message: 'Successfully applied ' + changed.length + ' bulk stock updates.' };
      await prisma.auditLog.create({ data: { userId: user.id, action: 'STOCK_BULK_APPLIED', entityType: 'INVENTORY_BATCH', details: { batchesCount: changed.length, changes: changed.map(p => ({ productId: p.productId, batchNumber: p.batchNumber, action: p.action, changes: p.changes, reason: p.reason })) } } });
      await prisma.operationReceipt.update({ where, data: { result } });
      return result;
    });
  },
};

