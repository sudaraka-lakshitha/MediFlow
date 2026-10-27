import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { isCountableUnit } from '../utils/unitMeasure.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { serializable } from '../utils/serializable.js';

const digest = (rows) => createHash('sha256').update(JSON.stringify(rows)).digest('hex');

export async function stockBulkPlan(tx, rows) {
  const plans = [];
  const errors = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Cache products and suppliers for quick lookups
  const allProducts = await tx.product.findMany({
    select: {
      id: true,
      sku: true,
      genericName: true,
      brandName: true,
      strength: true,
      dosageForm: true,
      unit: true,
      active: true,
      barcode: true,
      sellingPrice: true,
    },
  });

  const productByCode = new Map();
  for (const p of allProducts) {
    p.name = p.brandName ? `${p.genericName} (${p.brandName})` : p.genericName;
    p.code = p.sku;
    productByCode.set(p.sku.toUpperCase(), p);
    if (p.barcode) productByCode.set(p.barcode.trim(), p);
  }

  const allSuppliers = await tx.supplier.findMany({
    select: { id: true, name: true, active: true },
  });
  const supplierByName = new Map();
  for (const s of allSuppliers) {
    supplierByName.set(s.name.toLowerCase().trim(), s);
  }

  const seenBatchKeys = new Set();

  for (const [index, row] of rows.entries()) {
    const rowNum = Number(row.__sourceRow || index + 2);
    const skuRaw = String(row.sku || row.product_code || '').trim();
    const batchNumber = String(row.batch_number || row.batch || '').trim();
    const actionRaw = String(row.action || 'RECEIVE').trim().toUpperCase();
    const rawQty = String(row.quantity ?? '').trim();
    const rawCost = String(row.purchase_price ?? '').trim();
    const rawExpiry = String(row.expiry_date ?? '').trim();
    const supplierName = String(row.supplier_name ?? '').trim();
    const reason = String(row.reason ?? '').trim();

    // Skip empty row
    if (!skuRaw && !batchNumber && !rawQty) continue;

    if (!skuRaw) {
      errors.push({ row: rowNum, sku: 'N/A', message: 'Product SKU / Code is required.' });
      continue;
    }

    const product = productByCode.get(skuRaw.toUpperCase());
    if (!product) {
      errors.push({ row: rowNum, sku: skuRaw, message: `Product "${skuRaw}" was not found in the catalog.` });
      continue;
    }

    if (!product.active) {
      errors.push({ row: rowNum, sku: skuRaw, message: `Product "${product.name}" (${product.code}) is inactive.` });
      continue;
    }

    if (!batchNumber) {
      errors.push({ row: rowNum, sku: skuRaw, message: 'Batch number is required.' });
      continue;
    }

    if (batchNumber.length > 80) {
      errors.push({ row: rowNum, sku: skuRaw, message: 'Batch number exceeds 80 characters.' });
      continue;
    }

    const action = actionRaw === 'RESTOCK' ? 'RECEIVE' : actionRaw;
    if (!['RECEIVE', 'ADJUST'].includes(action)) {
      errors.push({ row: rowNum, sku: skuRaw, message: `Invalid action "${actionRaw}". Choose RECEIVE, RESTOCK, or ADJUST.` });
      continue;
    }

    if (!rawQty || isNaN(Number(rawQty))) {
      errors.push({ row: rowNum, sku: skuRaw, message: 'A valid numeric quantity is required.' });
      continue;
    }

    const qtyNum = Number(rawQty);
    const isCountable = isCountableUnit(product.unit);

    if (isCountable && !Number.isInteger(qtyNum)) {
      errors.push({
        row: rowNum,
        sku: skuRaw,
        message: `${product.name} is measured in "${product.unit}". Countable items must have whole integer quantities.`,
      });
      continue;
    }

    if (action === 'RECEIVE' && qtyNum <= 0) {
      errors.push({ row: rowNum, sku: skuRaw, message: 'Received quantity must be greater than zero.' });
      continue;
    }

    if (action === 'ADJUST' && qtyNum === 0) {
      errors.push({ row: rowNum, sku: skuRaw, message: 'Adjustment quantity cannot be zero.' });
      continue;
    }

    // Expiry date validation
    let expiryDate = null;
    if (rawExpiry) {
      const parsedDate = new Date(rawExpiry);
      if (isNaN(parsedDate.getTime())) {
        errors.push({ row: rowNum, sku: skuRaw, message: `Invalid expiry date "${rawExpiry}". Use YYYY-MM-DD.` });
        continue;
      }
      parsedDate.setHours(0, 0, 0, 0);
      expiryDate = parsedDate;
    }

    if (action === 'RECEIVE' && !expiryDate) {
      errors.push({ row: rowNum, sku: skuRaw, message: 'Expiry date is required for stock receipts.' });
      continue;
    }

    if (action === 'RECEIVE' && expiryDate <= today) {
      errors.push({ row: rowNum, sku: skuRaw, message: `Expiry date (${rawExpiry}) is in the past or today. Incoming stock must be unexpired.` });
      continue;
    }

    // Purchase price validation
    let purchasePrice = 0;
    if (rawCost) {
      purchasePrice = Number(rawCost);
      if (isNaN(purchasePrice) || purchasePrice < 0) {
        errors.push({ row: rowNum, sku: skuRaw, message: 'Purchase price must be a positive number.' });
        continue;
      }
    }

    // Supplier resolution
    let supplierId = null;
    if (supplierName) {
      const matched = supplierByName.get(supplierName.toLowerCase().trim());
      if (matched) {
        supplierId = matched.id;
      } else {
        // Find by partial match
        const partial = allSuppliers.find((s) => s.name.toLowerCase().includes(supplierName.toLowerCase().trim()));
        if (partial) supplierId = partial.id;
      }
    }

    // Check duplicate in file
    const batchKey = `${product.id}:${batchNumber.toUpperCase()}`;
    if (seenBatchKeys.has(batchKey)) {
      errors.push({ row: rowNum, sku: skuRaw, message: `Duplicate entry for batch "${batchNumber}" of product "${product.code}" in this upload.` });
      continue;
    }
    seenBatchKeys.add(batchKey);

    // Check existing batch in database
    const existing = await tx.inventoryBatch.findUnique({
      where: {
        productId_batchNumber: { productId: product.id, batchNumber },
      },
      include: { supplier: true },
    });

    if (action === 'ADJUST' && !existing) {
      errors.push({
        row: rowNum,
        sku: skuRaw,
        message: `Batch "${batchNumber}" does not exist for ${product.name}. Use RECEIVE to add a new batch.`,
      });
      continue;
    }

    const changes = [];
    let quantityBefore = 0;
    let quantityAfter = 0;
    let quantityChange = 0;

    if (action === 'RECEIVE') {
      if (existing) {
        quantityBefore = Number(existing.quantityAvailable);
        quantityChange = qtyNum;
        quantityAfter = quantityBefore + quantityChange;
        changes.push({
          field: 'quantity',
          label: 'Available Stock',
          before: `${quantityBefore} ${product.unit}`,
          after: `${quantityAfter} ${product.unit} (+${quantityChange})`,
        });
        if (purchasePrice && purchasePrice !== Number(existing.purchasePrice)) {
          changes.push({
            field: 'purchasePrice',
            label: 'Purchase Cost',
            before: `Rs. ${Number(existing.purchasePrice).toFixed(2)}`,
            after: `Rs. ${purchasePrice.toFixed(2)}`,
          });
        }
      } else {
        quantityBefore = 0;
        quantityChange = qtyNum;
        quantityAfter = qtyNum;
        changes.push({
          field: 'quantity',
          label: 'New Batch Stock',
          before: '0 (New)',
          after: `${quantityAfter} ${product.unit}`,
        });
        changes.push({
          field: 'expiryDate',
          label: 'Expiry Date',
          before: 'N/A',
          after: rawExpiry,
        });
        if (purchasePrice > 0) {
          changes.push({
            field: 'purchasePrice',
            label: 'Unit Cost',
            before: 'N/A',
            after: `Rs. ${purchasePrice.toFixed(2)}`,
          });
        }
      }
    } else if (action === 'ADJUST') {
      quantityBefore = Number(existing.quantityAvailable);
      quantityChange = qtyNum;
      quantityAfter = quantityBefore + quantityChange;

      if (quantityAfter < 0) {
        errors.push({
          row: rowNum,
          sku: skuRaw,
          message: `Adjustment (${quantityChange > 0 ? '+' : ''}${quantityChange}) would cause negative stock (current available: ${quantityBefore} ${product.unit}).`,
        });
        continue;
      }

      const reserved = Number(existing.quantityReserved);
      if (quantityAfter < reserved) {
        errors.push({
          row: rowNum,
          sku: skuRaw,
          message: `Cannot adjust available stock below ${reserved} ${product.unit} already reserved for active orders.`,
        });
        continue;
      }

      changes.push({
        field: 'quantity',
        label: 'Stock Adjustment',
        before: `${quantityBefore} ${product.unit}`,
        after: `${quantityAfter} ${product.unit} (${quantityChange > 0 ? '+' : ''}${quantityChange})`,
      });

      if (expiryDate && existing.expiryDate.getTime() !== expiryDate.getTime()) {
        changes.push({
          field: 'expiryDate',
          label: 'Expiry Date',
          before: existing.expiryDate.toISOString().split('T')[0],
          after: rawExpiry,
        });
      }
    }

    plans.push({
      row: rowNum,
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      unit: product.unit,
      batchNumber,
      action,
      existingBatchId: existing ? existing.id : null,
      supplierId: supplierId || (existing ? existing.supplierId : null),
      supplierName: supplierName || (existing?.supplier?.name || null),
      quantityChange,
      quantityBefore,
      quantityAfter,
      purchasePrice: purchasePrice || (existing ? Number(existing.purchasePrice) : 0),
      expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : (existing ? existing.expiryDate.toISOString().split('T')[0] : null),
      reason: reason || (action === 'RECEIVE' ? 'Bulk shipment receipt' : 'Bulk stock audit adjustment'),
      changes,
    });
  }

  const receives = plans.filter((p) => p.action === 'RECEIVE').length;
  const adjusts = plans.filter((p) => p.action === 'ADJUST').length;

  return {
    plans,
    errors,
    summary: {
      totalRows: rows.length,
      validUpdates: plans.length,
      receives,
      adjusts,
      errorsCount: errors.length,
    },
  };
}

export const stockBulkService = {
  async preview(rows, user) {
    const result = await stockBulkPlan(prisma, rows);
    const token = result.errors.length || !result.plans.length
      ? null
      : jwt.sign(
        { purpose: 'stock-bulk', userId: user.id, digest: digest(rows) },
        env.JWT_SECRET,
        { expiresIn: '15m' },
      );
    return { ...result, previewToken: token };
  },

  async apply(rows, previewToken, user) {
    if (!previewToken) throw new AppError(400, 'Preview token is required.');
    let claim;
    try {
      claim = jwt.verify(previewToken, env.JWT_SECRET);
    } catch {
      throw new AppError(401, 'Preview expired or invalid. Please re-validate the file.');
    }

    if (claim.purpose !== 'stock-bulk' || claim.userId !== user.id || claim.digest !== digest(rows)) {
      throw new AppError(409, 'File or user changed since preview was generated. Re-validate the file.');
    }

    return serializable(async (tx) => {
      const { plans, errors } = await stockBulkPlan(tx, rows);
      if (errors.length) {
        throw new AppError(422, `Cannot apply stock updates: ${errors.length} validation errors found.`);
      }
      if (!plans.length) {
        throw new AppError(400, 'No valid stock updates to apply.');
      }

      const affectedProductIds = new Set();
      const updatedBatches = [];

      for (const plan of plans) {
        affectedProductIds.add(plan.productId);

        if (plan.action === 'RECEIVE') {
          let batch;
          if (plan.existingBatchId) {
            // Increment existing batch
            batch = await tx.inventoryBatch.update({
              where: { id: plan.existingBatchId },
              data: {
                quantityReceived: { increment: plan.quantityChange },
                quantityAvailable: { increment: plan.quantityChange },
                purchasePrice: plan.purchasePrice ? new Prisma.Decimal(plan.purchasePrice) : undefined,
                supplierId: plan.supplierId || undefined,
              },
            });
          } else {
            // Create new batch
            batch = await tx.inventoryBatch.create({
              data: {
                productId: plan.productId,
                supplierId: plan.supplierId,
                batchNumber: plan.batchNumber,
                quantityReceived: new Prisma.Decimal(plan.quantityChange),
                quantityAvailable: new Prisma.Decimal(plan.quantityChange),
                purchasePrice: new Prisma.Decimal(plan.purchasePrice),
                expiryDate: new Date(plan.expiryDate),
              },
            });
          }

          // Create stock movement
          await tx.stockMovement.create({
            data: {
              productId: plan.productId,
              batchId: batch.id,
              type: 'RECEIPT',
              quantityChange: new Prisma.Decimal(plan.quantityChange),
              quantityBefore: new Prisma.Decimal(plan.quantityBefore),
              quantityAfter: new Prisma.Decimal(plan.quantityAfter),
              reason: plan.reason,
              performedById: user.id,
            },
          });

          updatedBatches.push(batch.id);
        } else if (plan.action === 'ADJUST') {
          const batch = await tx.inventoryBatch.update({
            where: { id: plan.existingBatchId },
            data: {
              quantityAvailable: new Prisma.Decimal(plan.quantityAfter),
              expiryDate: plan.expiryDate ? new Date(plan.expiryDate) : undefined,
            },
          });

          // Create stock movement
          await tx.stockMovement.create({
            data: {
              productId: plan.productId,
              batchId: batch.id,
              type: 'ADJUSTMENT',
              quantityChange: new Prisma.Decimal(plan.quantityChange),
              quantityBefore: new Prisma.Decimal(plan.quantityBefore),
              quantityAfter: new Prisma.Decimal(plan.quantityAfter),
              reason: plan.reason,
              performedById: user.id,
            },
          });

          updatedBatches.push(batch.id);
        }
      }

      // Clear low stock notes for replenished/adjusted products
      if (affectedProductIds.size) {
        await tx.lowStockAcknowledgement.deleteMany({
          where: { productId: { in: Array.from(affectedProductIds) } },
        });
      }

      // Record overarching audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'STOCK_BULK_APPLIED',
          entityType: 'INVENTORY_BATCH',
          details: {
            batchesCount: plans.length,
            receives: plans.filter((p) => p.action === 'RECEIVE').length,
            adjusts: plans.filter((p) => p.action === 'ADJUST').length,
            affectedProducts: Array.from(affectedProductIds),
          },
        },
      });

      return {
        applied: true,
        batchesUpdated: updatedBatches.length,
        message: `Successfully applied ${updatedBatches.length} bulk stock updates.`,
      };
    });
  },
};
