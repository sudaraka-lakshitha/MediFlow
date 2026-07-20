import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { saleFinancials } from '../utils/reportFinancials.js';
import { calculateDiscounts } from './discount.service.js';
import { batchAllocationOrder, operationSettingsService } from './operationSettings.service.js';

export const saleService = {
  async list(user) {
    const sales = await prisma.sale.findMany({
      where: user.role === 'PATIENT' ? { patientId: user.id } : {},
      include: { patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } }, cashier: { select: { fullName: true } }, paymentRequest: { select: { requestNumber: true } }, items: { include: { product: true, batch: true } }, discountApplications: true },
      orderBy: { createdAt: 'desc' }, take: 300,
    });
    return user.role === 'PATIENT' ? sales : sales.map((sale) => ({ ...sale, financials: saleFinancials(sale) }));
  },
  async getForUser(id, user) {
    const sale = await prisma.sale.findFirst({
      where: { id, ...(user.role === 'PATIENT' ? { patientId: user.id } : user.role === 'CASHIER' ? { cashierId: user.id } : {}) },
      include: { patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } }, cashier: { select: { fullName: true } }, paymentRequest: { select: { requestNumber: true } }, items: { include: { product: true, batch: true } }, dispensing: { include: { prescription: { select: { prescriptionNumber: true } } } } },
    });
    if (!sale) throw new AppError(404, 'Invoice not found.');
    return sale;
  },
  async pay(id, amount, paymentMethod) {
    const sale = await prisma.sale.findUnique({ where: { id } });
    if (!sale) throw new AppError(404, 'Sale not found.');
    if (sale.status === 'VOIDED') throw new AppError(409, 'A voided sale cannot be paid.');
    if (sale.status === 'PAID') throw new AppError(409, 'This invoice has already been paid.');
    const amountPaid = sale.amountPaid.add(amount);
    const updated = await prisma.sale.updateMany({
      where: { id, status: 'PENDING', amountPaid: sale.amountPaid },
      data: { amountPaid, paymentMethod, status: amountPaid.greaterThanOrEqualTo(sale.total) ? 'PAID' : 'PENDING' },
    });
    if (updated.count !== 1) throw new AppError(409, 'This invoice was just updated by another user. Refresh before accepting another payment.');
    return prisma.sale.findUnique({ where: { id } });
  },
  async createRetail(input, pharmacistId) {
    return prisma.$transaction(async (tx) => {
      const actor = await tx.user.findUnique({ where: { id: pharmacistId }, select: { role: true, cashierAccess: true } });
      if (!actor) throw new AppError(403, 'Billing user is unavailable.');
      if (input.patientId) {
        const patient = await tx.user.findFirst({ where: { id: input.patientId, role: 'PATIENT', active: true } });
        if (!patient) throw new AppError(400, 'The selected patient account is unavailable.');
      }
      const requestedIds = [...new Set(input.items.map((item) => item.productId))];
      const products = await tx.product.findMany({ where: { id: { in: requestedIds }, active: true }, include: { category: true } });
      const byId = new Map(products.map((product) => [product.id, product]));
      const allocations = []; let subtotal = new Prisma.Decimal(0); const now = new Date();
      const operationSettings = await operationSettingsService.get(tx);
      const allocationOrder = batchAllocationOrder(operationSettings.allocationMethod);
      for (const requested of input.items) {
        const product = byId.get(requested.productId);
        if (!product) throw new AppError(404, `Product ${requested.productId} was not found.`);
        if (product.prescriptionRequired) throw new AppError(409, `${product.genericName} requires a prescription and cannot be added to a retail bill.`);
        const requestedQuantity = new Prisma.Decimal(requested.quantity);
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: product.id } });
        const batches = await tx.inventoryBatch.findMany({ where: { productId: product.id, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, orderBy: allocationOrder });
        const available = batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
        if (available.lessThan(requestedQuantity)) throw new AppError(409, `Insufficient usable stock for ${product.genericName}.`);
        let left = requestedQuantity;
        for (const batch of batches) {
          if (left.isZero()) break;
          const quantity = Prisma.Decimal.min(left, batch.quantityAvailable); const lineTotal = product.sellingPrice.mul(quantity); const after = batch.quantityAvailable.sub(quantity);
          await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: after } });
          allocations.push({ productId: product.id, categoryId: product.categoryId, batchId: batch.id, quantity, unitPrice: product.sellingPrice, lineTotal, quantityBefore: batch.quantityAvailable, quantityAfter: after, productName: product.genericName });
          subtotal = subtotal.add(lineTotal); left = left.sub(quantity);
        }
      }
      const discountResult = await calculateDiscounts(tx, allocations, subtotal, input.couponCode);
      const discount = discountResult.amount; const tax = new Prisma.Decimal(input.tax); const total = Prisma.Decimal.max(0, subtotal.sub(discount).add(tax)); const amountPaid = new Prisma.Decimal(input.amountPaid);
      const sale = await tx.sale.create({ data: { invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`, patientId: input.patientId || null, pharmacistId, cashierId: pharmacistId, subtotal, discount, tax, total, amountPaid, paymentMethod: input.paymentMethod, status: amountPaid.greaterThanOrEqualTo(total) ? 'PAID' : 'PENDING', items: { create: allocations.map(({ categoryId, quantityBefore, quantityAfter, productName, ...item }) => item) }, discountApplications: { create: discountResult.applications } } });
      for (const item of allocations) await tx.stockMovement.create({ data: { productId: item.productId, batchId: item.batchId, type: 'RETAIL_SALE', quantityChange: item.quantity.negated(), quantityBefore: item.quantityBefore, quantityAfter: item.quantityAfter, referenceType: 'SALE', referenceId: sale.id, reason: 'Retail counter sale', performedById: pharmacistId } });
      return tx.sale.findUnique({ where: { id: sale.id }, include: { patient: { select: { fullName: true } }, items: { include: { product: true, batch: true } }, discountApplications: true } });
    }, { isolationLevel: 'Serializable' });
  },
};
