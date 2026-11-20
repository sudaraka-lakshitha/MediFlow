// STOCK (inventory batches)
// Stock is kept in batches: each batch is one delivery of a product with its own expiry date and
// cost.
// Two numbers matter on each batch:
//   - quantity_available: what is physically on the shelf
//   - quantity_reserved: how much of that is set aside for paid or prepared orders
// Free stock = available - reserved.
// Every change to stock is also written to the stock movements list, so you can trace any number.

import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { operationSettingsService } from './operationSettings.service.js';
import { lowStockState } from '../utils/lowStock.js';
import { usableStockTotal } from '../utils/stock.js';
import { DEFAULT_TRANSACTION_OPTIONS, serializable } from '../utils/serializable.js';
import { historySearch } from '../utils/historySearch.js';

export const inventoryService = {
  // List batches page by page, with search.
  listBatches: ({ page = 1, pageSize = 300, search } = {}) => prisma.inventoryBatch.findMany({
    where: historySearch(search, ['batchNumber', 'product.genericName', 'product.strength', 'supplier.name']),
    include: {
      product: { include: { category: true, manufacturer: true } },
      supplier: true,
      stockMovements: {
        where: { referenceType: { startsWith: 'EXPIRED_' } },
        include: { performedBy: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: [{ expiryDate: 'asc' }, { receivedAt: 'asc' }, { id: 'asc' }],
    skip: (page - 1) * pageSize, take: pageSize,
  }),
  // List the history of stock changes.
  listMovements: ({ page = 1, pageSize = 300, search, status } = {}) => prisma.stockMovement.findMany({ where: { ...(status ? { type: status } : {}), ...historySearch(search, ['batch.batchNumber', 'product.genericName', 'product.strength', 'performedBy.fullName', 'reason']) }, include: { product: true, batch: true, performedBy: { select: { fullName: true } } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize }),
  // Low-stock and near-expiry warnings for the dashboard. "Near expiry" uses the number of days set
  // in operation settings.
  async alerts() {
    const today = new Date();
    const settings = await operationSettingsService.get();
    const near = new Date(today); near.setDate(near.getDate() + settings.nearExpiryDays);
    const [expired, nearExpiry, products] = await Promise.all([
      prisma.inventoryBatch.count({ where: { expiryDate: { lt: today }, quantityAvailable: { gt: 0 } } }),
      prisma.inventoryBatch.count({ where: { expiryDate: { gte: today, lte: near }, quantityAvailable: { gt: 0 } } }),
      prisma.product.findMany({
        where: { active: true },
        include: {
          lowStockAcknowledgement: { select: { stockLevel: true } },
          batches: { where: { expiryDate: { gte: today }, restricted: false }, select: { quantityAvailable: true, quantityReserved: true } },
        },
      }),
    ]);
    const stockStates = products.map(lowStockState);
    return {
      expiredBatches: expired,
      nearExpiryBatches: nearExpiry,
      nearExpiryDays: settings.nearExpiryDays,
      allocationMethod: settings.allocationMethod,
      lowStockProducts: stockStates.filter((state) => state.lowStock).length,
      lowStockRequiresAttention: stockStates.filter((state) => state.requiresAttention).length,
    };
  },
  // A staff member notes they have seen a low-stock warning, so it stops showing until the stock
  // changes again.
  async acknowledgeLowStock(productId, userId) {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: {
          batches: {
            where: { expiryDate: { gte: now }, quantityAvailable: { gt: 0 }, restricted: false },
            select: { quantityAvailable: true, quantityReserved: true },
          },
        },
      });
      if (!product || !product.active) throw new AppError(404, 'Active product not found.');
      const stockLevel = usableStockTotal(product.batches);
      if (stockLevel.greaterThan(product.reorderLevel)) throw new AppError(409, 'This product is no longer at or below its reorder level.');
      return tx.lowStockAcknowledgement.upsert({
        where: { productId },
        update: { stockLevel, acknowledgedById: userId, acknowledgedAt: now },
        create: { productId, stockLevel, acknowledgedById: userId, acknowledgedAt: now },
        include: { acknowledgedBy: { select: { id: true, fullName: true } } },
      });
    }, DEFAULT_TRANSACTION_OPTIONS);
  },
  // Remove that note so the warning shows again.
  async clearLowStockAcknowledgement(productId) {
    const result = await prisma.lowStockAcknowledgement.deleteMany({ where: { productId } });
    return { cleared: result.count > 0 };
  },
  // Record new stock arriving from a supplier (a new batch).
  receive(data, userId) {
    return serializable(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: data.productId }, select: { unit: true } });
      if (!product) throw new AppError(404, 'Product not found.');
      const quantity = stockQuantity(data.quantity, product.unit);
      const batch = await tx.inventoryBatch.create({ data: { productId: data.productId, supplierId: data.supplierId, batchNumber: data.batchNumber, quantityReceived: quantity, quantityAvailable: quantity, purchasePrice: data.purchasePrice, expiryDate: data.expiryDate } });
      await tx.lowStockAcknowledgement.deleteMany({ where: { productId: data.productId } });
      await tx.stockMovement.create({ data: { productId: data.productId, batchId: batch.id, type: 'RECEIPT', quantityChange: quantity, quantityBefore: 0, quantityAfter: quantity, reason: data.note, performedById: userId } });
      return batch;
    });
  },
  // Correct a batch's details such as expiry date, cost or price.
  updateBatch: (id, data) => prisma.$transaction(async (tx) => {
    const current = await tx.inventoryBatch.findUnique({ where: { id } });
    if (!current) throw new AppError(404, 'Inventory batch not found.');
    const currentlyExpired = current.expiryDate < new Date();
    const expiryChanged = current.expiryDate.getTime() !== new Date(data.expiryDate).getTime();
    if (currentlyExpired && expiryChanged) {
      throw new AppError(409, 'Expired batches cannot have their expiry date changed here — use "Process expired stock" instead.');
    }
    const batch = await tx.inventoryBatch.update({ where: { id }, data: { supplierId: data.supplierId, batchNumber: data.batchNumber, purchasePrice: data.purchasePrice, expiryDate: data.expiryDate }, include: { product: true, supplier: true } });
    await tx.lowStockAcknowledgement.deleteMany({ where: { productId: batch.productId } });
    return batch;
  }, DEFAULT_TRANSACTION_OPTIONS),
  // Stop (or allow again) a batch being sold, for example while it is being checked or recalled.
  async setRestriction(id, data) {
    const batch = await prisma.inventoryBatch.findUnique({ where: { id } });
    if (!batch) throw new AppError(404, 'Inventory batch not found.');
    if (data.restricted && Number(batch.quantityAvailable) <= 0) throw new AppError(409, 'An empty batch does not need to be restricted.');
    return prisma.inventoryBatch.update({
      where: { id },
      data: {
        restricted: data.restricted,
        restrictionReason: data.restricted ? data.reason.trim() : null,
        restrictedAt: data.restricted ? new Date() : null,
      },
      include: { product: true, supplier: true },
    });
  },
  // Change a batch's quantity by hand (damage, counting error). Stock can never go below zero or
  // below what is already set aside for customers. The change is saved in the stock movements list.
  adjust(batchId, data, userId) {
    return serializable(async (tx) => {
      const batch = await tx.inventoryBatch.findUnique({ where: { id: batchId }, include: { product: true } });
      if (!batch) throw new AppError(404, 'Inventory batch not found.');
      const change = stockQuantity(data.quantityChange, batch.product.unit, { signed: true });
      const quantityAfter = batch.quantityAvailable.add(change);
      if (quantityAfter.isNegative()) throw new AppError(409, 'The adjustment would make stock negative.');
      if (quantityAfter.lessThan(batch.quantityReserved)) throw new AppError(409, `This batch has ${batch.quantityReserved} unit(s) already reserved against paid bills — the adjustment cannot bring available stock below that.`);
      const updated = await tx.inventoryBatch.update({ where: { id: batchId }, data: { quantityAvailable: quantityAfter } });
      await tx.lowStockAcknowledgement.deleteMany({ where: { productId: batch.productId } });
      await tx.stockMovement.create({ data: { productId: batch.productId, batchId, type: 'ADJUSTMENT', quantityChange: new Prisma.Decimal(data.quantityChange), quantityBefore: batch.quantityAvailable, quantityAfter, reason: data.reason, performedById: userId } });
      return updated;
    });
  },
  // Remove expired stock from a batch and record why (returned to supplier, destroyed...).
  disposeExpired(batchId, data, userId) {
    return serializable(async (tx) => {
      const batch = await tx.inventoryBatch.findUnique({
        where: { id: batchId },
        include: { product: true, supplier: true },
      });
      if (!batch) throw new AppError(404, 'Inventory batch not found.');
      if (batch.expiryDate >= new Date()) throw new AppError(409, 'Only expired stock can use the expiry disposition workflow.');
      const quantity = stockQuantity(data.quantity, batch.product.unit);
      if (quantity.greaterThan(batch.quantityAvailable)) throw new AppError(409, 'Disposition quantity exceeds the remaining batch stock.');
      if (batch.quantityAvailable.sub(quantity).lessThan(batch.quantityReserved)) throw new AppError(409, `This batch has ${batch.quantityReserved} unit(s) already reserved against paid bills — release or fulfill those first.`);

      const quantityAfter = batch.quantityAvailable.sub(quantity);
      const returned = data.action.startsWith('RETURNED_');
      const referenceType = `EXPIRED_${data.action}`;
      const destination = returned ? ` Destination: ${data.destinationName}.` : '';
      const reason = `${data.action.replaceAll('_', ' ')}.${destination} ${data.reason}`.slice(0, 300);
      const updated = await tx.inventoryBatch.update({
        where: { id: batchId },
        data: { quantityAvailable: quantityAfter },
      });
      await tx.lowStockAcknowledgement.deleteMany({ where: { productId: batch.productId } });
      const movement = await tx.stockMovement.create({
        data: {
          productId: batch.productId,
          batchId,
          type: returned ? 'RETURN' : 'EXPIRED',
          quantityChange: quantity.negated(),
          quantityBefore: batch.quantityAvailable,
          quantityAfter,
          referenceType,
          referenceId: batch.id,
          reason,
          performedById: userId,
        },
        include: { performedBy: { select: { id: true, fullName: true } } },
      });
      return {
        batch: updated,
        movement,
        action: data.action,
        destinationName: data.destinationName || null,
      };
    });
  },
  // Delete a batch that was entered by mistake. Only an empty batch (nothing left on the shelf) can be deleted.
  async deleteBatch(batchId) {
    return prisma.$transaction(async (tx) => {
      const batch = await tx.inventoryBatch.findUnique({
        where: { id: batchId },
      });
      if (!batch) throw new AppError(404, 'Inventory batch not found.');
      if (Number(batch.quantityAvailable) !== 0) {
        throw new AppError(409, 'Only empty batches (available quantity = 0) can be deleted.');
      }
      const [movementCount, dispensingCount, saleCount] = await Promise.all([
        tx.stockMovement.count({ where: { batchId, type: { not: 'RECEIPT' } } }),
        tx.dispensingItem.count({ where: { batchId } }),
        tx.saleItem.count({ where: { batchId } }),
      ]);
      if (movementCount > 0 || dispensingCount > 0 || saleCount > 0) {
        throw new AppError(409, 'This batch has transaction history and cannot be deleted. Only a batch that was received but never issued against can be removed.');
      }
      await tx.stockMovement.deleteMany({ where: { batchId } });
      return tx.inventoryBatch.delete({ where: { id: batchId } });
    }, DEFAULT_TRANSACTION_OPTIONS);
  },
};
