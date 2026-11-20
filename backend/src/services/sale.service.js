// SALES (invoices)
// A sale is the final record made when medicines are actually handed over.
// This file lists sales, records over-the-counter sales, and voids a sale when it was a mistake
// (the stock goes back on the shelf and a refund record is made).

import crypto from 'node:crypto';
import { historySearch } from '../utils/historySearch.js';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { customerInvoice } from '../utils/customerInvoice.js';
import { latestPartialDecisions, PARTIAL_SUPPLY_EVENT, supplyBalance, supplyRows } from '../utils/prescriptionBalance.js';
import { saleFinancials } from '../utils/reportFinancials.js';
import { assertCouponMatched, calculateDiscounts } from './discount.service.js';
import { batchAllocationOrder, operationSettingsService } from './operationSettings.service.js';
import { withUniqueRetry } from '../utils/withUniqueRetry.js';
import { isSameLocalDay } from '../utils/localDate.js';
import { serializable } from '../utils/serializable.js';
import { assertUnusedBankReference } from '../utils/bankReference.js';
import { assertRetailAgeSuitability } from '../utils/ageSuitability.js';
import { usableQuantity, usableStockTotal } from '../utils/stock.js';
import { invoiceDispensingInclude } from '../utils/patientMedicineInstructions.js';

// The related details loaded with every sale (people, items, payments).
const saleDetailInclude = { patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } }, cashier: { select: { fullName: true } }, paymentRequest: { select: { requestNumber: true } }, items: { include: { product: true, batch: true } }, discountApplications: true };

export const saleService = {
  // List sales page by page. Patients only see their own.
  async list(user, { page = 1, pageSize = 300, search } = {}) {
    const sales = await prisma.sale.findMany({
      where: { ...(user.role === 'PATIENT' ? { patientId: user.id } : {}), ...historySearch(search, ['invoiceNumber', 'patient.fullName', 'paymentRequest.requestNumber']) },
      include: { refunds: { include: { lines: true } }, patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } }, cashier: { select: { fullName: true } }, paymentRequest: { select: { requestNumber: true } }, items: { include: { product: true, batch: true } }, discountApplications: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize,
    });
    return user.role === 'PATIENT' ? sales.map(customerInvoice) : sales.map((sale) => ({ ...sale, financials: saleFinancials(sale) }));
  },
  // Load one sale, checking the person may see it.
  async getForUser(id, user) {
    const sale = await prisma.sale.findFirst({
      // Pharmacy staff share invoice read access, as they do in the sales list.
      // Payment attribution still belongs to the cashier who records each payment.
      where: { id, ...(user.role === 'PATIENT' ? { patientId: user.id } : {}) },
      include: { refunds: { include: { lines: true } }, patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } }, cashier: { select: { fullName: true } }, paymentRequest: { select: { requestNumber: true, events: { where: { kind: PARTIAL_SUPPLY_EVENT }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], select: { kind: true, details: true } } } }, items: { include: { product: true, batch: true } }, dispensing: { include: invoiceDispensingInclude } },
    });
    if (!sale) throw new AppError(404, 'Invoice not found.');
    // A partly supplied prescription: show what can still be collected later.
    const { later, notIssued } = sale.status === 'VOIDED' ? { later: [], notIssued: [] } : supplyBalance(sale.dispensing?.prescription?.items, null, latestPartialDecisions(sale.paymentRequest?.events));
    const withBalance = { ...sale, balanceToCollect: later, notToBeIssued: notIssued, supplyRows: sale.status === 'VOIDED' ? [] : supplyRows(sale.paymentRequest?.events) };
    return user.role === 'PATIENT' ? customerInvoice(withBalance) : withBalance;
  },
  // Record payment against a sale that was not fully paid.
  async pay(id, amount, paymentMethod, cashierId, reference) {
    return serializable(async (tx) => {
    const sale = await tx.sale.findUnique({ where: { id } });
    if (!sale) throw new AppError(404, 'Sale not found.');
    if (sale.status === 'VOIDED') throw new AppError(409, 'A voided sale cannot be paid.');
    if (sale.status === 'PAID') throw new AppError(409, 'This invoice has already been paid.');
    const amountPaid = sale.amountPaid.add(amount);
    if (!cashierId || !new Prisma.Decimal(amount).greaterThan(0) || new Prisma.Decimal(amount).decimalPlaces() > 2 || amountPaid.greaterThan(sale.total)) throw new AppError(400, 'Record only the outstanding amount, after returning any cash change.');
    if (paymentMethod === 'BANK_TRANSFER') reference = await assertUnusedBankReference(tx, reference);
    const updated = await tx.sale.updateMany({
      where: { id, status: 'PENDING', amountPaid: sale.amountPaid },
      data: { amountPaid, paymentMethod, status: amountPaid.greaterThanOrEqualTo(sale.total) ? 'PAID' : 'PENDING' },
    });
    if (updated.count !== 1) throw new AppError(409, 'This invoice was just updated by another user. Refresh before accepting another payment.');
    await tx.salePayment.create({ data: { saleId: id, amount, method: paymentMethod, reference, cashierId } });
    return tx.sale.findUnique({ where: { id } });
    });
  },
  // A quick over-the-counter sale: stock is taken off the shelf and payment is recorded at once.
  async createRetail(input, pharmacistId) {
    return serializable(async (tx) => {
      const actor = await tx.user.findUnique({ where: { id: pharmacistId }, select: { role: true, cashierAccess: true } });
      if (!actor) throw new AppError(403, 'Billing user is unavailable.');
      if (input.patientId) {
        const patient = await tx.user.findFirst({ where: { id: input.patientId, role: 'PATIENT', OR: [{ active: true }, { email: { endsWith: '@patients.mediflow.invalid' } }] } });
        if (!patient) throw new AppError(400, 'The selected patient account is unavailable.');
      }
      const requestedIds = [...new Set(input.items.map((item) => item.productId))];
      const products = await tx.product.findMany({ where: { id: { in: requestedIds }, active: true }, include: { category: true } });
      await assertRetailAgeSuitability(input.patientId, products);
      const byId = new Map(products.map((product) => [product.id, product]));
      const allocations = []; let subtotal = new Prisma.Decimal(0); const now = new Date();
      const operationSettings = await operationSettingsService.get(tx);
      const allocationOrder = batchAllocationOrder(operationSettings.allocationMethod);
      for (const requested of input.items) {
        const product = byId.get(requested.productId);
        if (!product) throw new AppError(404, `Product ${requested.productId} was not found.`);
        if (product.prescriptionRequired) throw new AppError(409, `${product.genericName} requires a prescription and cannot be added to a retail bill.`);
        const requestedQuantity = stockQuantity(requested.quantity, product.unit);
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: product.id } });
        const batches = await tx.inventoryBatch.findMany({ where: { productId: product.id, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, orderBy: allocationOrder });
        const available = usableStockTotal(batches);
        if (available.lessThan(requestedQuantity)) throw new AppError(409, `Insufficient usable stock for ${product.genericName}.`);
        let left = requestedQuantity;
        for (const batch of batches) {
          if (left.isZero()) break;
          const usable = usableQuantity(batch);
          if (usable.lessThanOrEqualTo(0)) continue;
          const quantity = Prisma.Decimal.min(left, usable); const lineTotal = product.sellingPrice.mul(quantity); const after = batch.quantityAvailable.sub(quantity);
          await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: after } });
          allocations.push({ productId: product.id, categoryId: product.categoryId, batchId: batch.id, quantity, unitPrice: product.sellingPrice, unitCost: batch.purchasePrice, lineTotal, quantityBefore: batch.quantityAvailable, quantityAfter: after, productName: product.genericName });
          subtotal = subtotal.add(lineTotal); left = left.sub(quantity);
        }
      }
      const discountResult = assertCouponMatched(await calculateDiscounts(tx, allocations, subtotal, input.couponCode));
      const discount = discountResult.amount; const tax = new Prisma.Decimal(input.tax); const total = Prisma.Decimal.max(0, subtotal.sub(discount).add(tax)); const amountPaid = new Prisma.Decimal(input.amountPaid);
      if (amountPaid.lessThan(0) || amountPaid.decimalPlaces() > 2) throw new AppError(400, 'Payment must be a non-negative amount with at most two decimal places.');
      const paymentReference = amountPaid.greaterThan(0) && input.paymentMethod === 'BANK_TRANSFER'
        ? await assertUnusedBankReference(tx, input.paymentReference) : input.paymentReference;
      const sale = await withUniqueRetry(() => tx.sale.create({ data: { invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`, patientId: input.patientId || null, pharmacistId, cashierId: pharmacistId, subtotal, discount, tax, total, amountPaid, paymentMethod: input.paymentMethod, status: amountPaid.greaterThanOrEqualTo(total) ? 'PAID' : 'PENDING', items: { create: allocations.map(({ categoryId, quantityBefore, quantityAfter, productName, ...item }) => item) }, discountApplications: { create: discountResult.applications } } }));
      if (amountPaid.greaterThan(total)) throw new AppError(400, 'Amount paid cannot exceed the invoice total. Record payment after returning change.');
      if (amountPaid.greaterThan(0)) await tx.salePayment.create({ data: { saleId: sale.id, amount: amountPaid, method: input.paymentMethod, reference: paymentReference || null, cashierId: pharmacistId } });
      for (const item of allocations) await tx.stockMovement.create({ data: { productId: item.productId, batchId: item.batchId, type: 'RETAIL_SALE', quantityChange: item.quantity.negated(), quantityBefore: item.quantityBefore, quantityAfter: item.quantityAfter, referenceType: 'SALE', referenceId: sale.id, reason: 'Retail counter sale', performedById: pharmacistId } });
      return tx.sale.findUnique({ where: { id: sale.id }, include: { patient: { select: { fullName: true } }, items: { include: { product: true, batch: true } }, discountApplications: true } });
    });
  },
  // Cancel a finished sale by mistake. The stock is returned and a refund record is created. The
  // reason is saved in the audit log.
  async voidSale(id, reason, userId, userRole) {
    return serializable(async (tx) => {
      const sale = await tx.sale.findUnique({ where: { id }, include: { items: true } });
      if (!sale) throw new AppError(404, 'Sale not found.');
      if (sale.status === 'VOIDED') throw new AppError(409, 'This sale has already been voided.');
      if (sale.dispensingId || sale.status === 'PAID' || sale.status === 'REFUNDED') throw new AppError(409, 'Use the refund / return workflow for a completed sale. Stock requires a separate pharmacist review.');
      if (sale.paymentRequestId) throw new AppError(409, 'Cancel this order through its cashier payment request.');
      if (userRole !== 'ADMIN' && !isSameLocalDay(sale.createdAt, new Date())) {
        throw new AppError(409, 'This sale can only be voided on the same day it was made.');
      }
      if (sale.amountPaid.greaterThan(0)) {
        const existing = await tx.refund.count({ where: { saleId: id } });
        if (existing) throw new AppError(409, 'This invoice already has a refund. Refresh its refund history.');
        const claim = await tx.sale.updateMany({ where: { id, status: 'PENDING', amountPaid: sale.amountPaid }, data: { status: 'VOIDED' } });
        if (claim.count !== 1) throw new AppError(409, 'The invoice changed. Refresh before cancelling.');
        let remaining = sale.amountPaid;
        const products = await tx.product.findMany({ where: { id: { in: sale.items.map(item => item.productId) } }, select: { id: true, genericName: true } });
        const lines = sale.items.map((item, index) => {
          const amount = index === sale.items.length - 1 ? remaining : sale.subtotal.isZero() ? new Prisma.Decimal(0) : Prisma.Decimal.min(remaining, sale.amountPaid.mul(item.lineTotal).div(sale.subtotal).toDecimalPlaces(2));
          remaining = remaining.sub(amount);
          return { saleItemId: item.id, productId: item.productId, batchId: item.batchId, name: products.find(product => product.id === item.productId)?.genericName || 'Retail item', quantity: item.quantity, amount };
        });
        await tx.refund.create({ data: { saleId: id, amount: sale.amountPaid, reason, createdById: userId, lines: { create: lines } } });
        // Preserve the original invoice/payment evidence. No stock is released
        // until the returned items have been reviewed by a pharmacist.
        await tx.auditLog.create({ data: { userId, action: 'PART_PAID_SALE_CANCELLED', entityType: 'SALE', entityId: id, details: { reason, refundAmount: String(sale.amountPaid), cancelledBalance: String(sale.total.sub(sale.amountPaid)) } } });
        return tx.sale.findUnique({ where: { id }, include: saleDetailInclude });
      }
      for (const item of sale.items) {
        const batch = await tx.inventoryBatch.findUnique({ where: { id: item.batchId } });
        if (!batch) continue;
        const after = batch.quantityAvailable.add(item.quantity);
        await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: after } });
        await tx.stockMovement.create({ data: { productId: item.productId, batchId: batch.id, type: 'REVERSAL', quantityChange: item.quantity, quantityBefore: batch.quantityAvailable, quantityAfter: after, referenceType: 'SALE', referenceId: sale.id, reason, performedById: userId } });
      }
      const claimed = await tx.sale.updateMany({ where: { id, status: { not: 'VOIDED' } }, data: { status: 'VOIDED' } });
      if (claimed.count !== 1) throw new AppError(409, 'This sale was just updated by someone else. Refresh and try again.');
      return tx.sale.findUnique({ where: { id }, include: saleDetailInclude });
    });
  },
};
