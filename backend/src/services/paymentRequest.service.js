import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { decryptPickupPin, encryptPickupPin, generatePickupPin, hashPickupPin } from '../utils/pickupPin.js';
import { prescriptionService } from './prescription.service.js';
import { calculateDiscounts } from './discount.service.js';
import { verifyPickupPin } from '../utils/pickupPin.js';
import { batchAllocationOrder, operationSettingsService } from './operationSettings.service.js';

const include = {
  patient: { select: { id: true, fullName: true, email: true, phone: true } },
  pharmacist: { select: { id: true, fullName: true } },
  cashier: { select: { id: true, fullName: true } },
  prescription: { select: { id: true, prescriptionNumber: true, status: true, sourceUploadId: true } },
  items: { include: { product: { select: { id: true, genericName: true, strength: true, unit: true, productType: true, prescriptionRequired: true } } } },
  sale: { select: { id: true, invoiceNumber: true } },
};

const canView = (record, user) => user.role !== 'PATIENT' || record.patientId === user.id;
const safeRecord = ({ pickupPinHash, pickupPinEncrypted, ...record }) => record;

export const paymentRequestService = {
  async list(user) {
    return (await prisma.paymentRequest.findMany({
      where: user.role === 'PATIENT' ? { patientId: user.id } : {},
      include,
      orderBy: { createdAt: 'desc' },
      take: 300,
    })).map(safeRecord);
  },
  async get(id, user) {
    const record = await prisma.paymentRequest.findUnique({ where: { id }, include });
    if (!record || !canView(record, user)) throw new AppError(404, 'Payment request not found.');
    return record;
  },
  async create(prescriptionId, input, pharmacistId) {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { patient: true, items: true, paymentRequest: true },
    });
    if (!prescription) throw new AppError(404, 'Prescription not found.');
    if (!['VERIFIED', 'PARTIALLY_DISPENSED'].includes(prescription.status)) throw new AppError(409, 'Verify the prescription before sending it to the cashier.');
    if (prescription.paymentRequest && prescription.paymentRequest.status !== 'CANCELLED') throw new AppError(409, 'This prescription already has an active cashier payment request.');
    const quantities = new Map(input.items.map((item) => [Number(item.prescriptionItemId), Number(item.quantity)]));
    const incomplete = prescription.items.some((item) => Number(item.prescribedQuantity.sub(item.dispensedQuantity)) !== Number(quantities.get(item.id) || 0));
    if (incomplete) throw new AppError(409, 'Every remaining prescribed item must be included in the cashier request.');
    const quote = await prescriptionService.quoteDispensing(prescriptionId, { ...input, amountPaid: 0, paymentMethod: 'CASH' });
    return prisma.paymentRequest.create({
      data: {
        requestNumber: `PAY-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        prescriptionId, patientId: prescription.patient.userId, pharmacistId,
        subtotal: quote.subtotal, discount: quote.discount, containerFee: quote.containerFee, tax: quote.tax, total: quote.total,
        couponCode: input.couponCode || null,
        items: { create: quote.lines.map((line) => ({ prescriptionItemId: line.prescriptionItemId, productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice, lineTotal: line.lineTotal })) },
      },
      include,
    });
  },
  async retailOptions() {
    const [products, patients] = await Promise.all([
      prisma.product.findMany({
        where: { active: true, prescriptionRequired: false },
        select: {
          id: true, sku: true, barcode: true, genericName: true, strength: true, unit: true, productType: true, sellingPrice: true,
          batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: new Date() }, restricted: false }, select: { quantityAvailable: true } },
        },
        orderBy: { genericName: 'asc' },
      }),
      prisma.user.findMany({ where: { role: 'PATIENT', active: true }, select: { id: true, fullName: true, phone: true, email: true }, orderBy: { fullName: 'asc' }, take: 500 }),
    ]);
    return { products, patients };
  },
  async createRetail(input, pharmacistId) {
    if (input.patientId) {
      const patient = await prisma.user.findFirst({ where: { id: input.patientId, role: 'PATIENT', active: true }, select: { id: true } });
      if (!patient) throw new AppError(400, 'The selected patient account is unavailable.');
    }
    const requestedIds = [...new Set(input.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: requestedIds }, active: true, prescriptionRequired: false }, include: { category: true, batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: new Date() }, restricted: false } } } });
    const byId = new Map(products.map((product) => [product.id, product]));
    const lines = []; const allocations = []; let subtotal = new Prisma.Decimal(0);
    for (const requested of input.items) {
      const product = byId.get(requested.productId);
      if (!product) throw new AppError(404, `Retail product ${requested.productId} was not found or requires a prescription.`);
      const quantity = new Prisma.Decimal(requested.quantity);
      const available = product.batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
      if (available.lessThan(quantity)) throw new AppError(409, `Insufficient usable stock for ${product.genericName}.`);
      const lineTotal = product.sellingPrice.mul(quantity).toDecimalPlaces(2);
      subtotal = subtotal.add(lineTotal);
      lines.push({ productId: product.id, quantity, unitPrice: product.sellingPrice, lineTotal });
      allocations.push({ productId: product.id, categoryId: product.categoryId, quantity, unitPrice: product.sellingPrice, lineTotal });
    }
    subtotal = subtotal.toDecimalPlaces(2);
    const discountResult = await calculateDiscounts(prisma, allocations, subtotal, input.couponCode);
    const tax = new Prisma.Decimal(input.tax).toDecimalPlaces(2);
    const total = Prisma.Decimal.max(0, subtotal.sub(discountResult.amount).add(tax)).toDecimalPlaces(2);
    return prisma.paymentRequest.create({
      data: {
        type: 'RETAIL', requestNumber: `RET-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        patientId: input.patientId || null, pharmacistId, subtotal, discount: discountResult.amount, tax, total, couponCode: input.couponCode || null,
        items: { create: lines },
      },
      include,
    });
  },
  async pay(id, paymentMethod, cashierId, paymentReference) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.paymentRequest.findUnique({ where: { id } });
      if (!current) throw new AppError(404, 'Payment request not found.');
      if (current.status !== 'AWAITING_PAYMENT') throw new AppError(409, 'This payment request is not awaiting payment.');
      const pin = generatePickupPin();
      const claimed = await tx.paymentRequest.updateMany({
        where: { id, status: 'AWAITING_PAYMENT' },
        data: {
          amountPaid: current.total, paymentMethod, paymentReference: paymentReference || null, cashierId, paidAt: new Date(), status: 'PAID',
          pickupPinHash: hashPickupPin(id, pin), pickupPinEncrypted: encryptPickupPin(pin), pinAttempts: 0,
        },
      });
      if (claimed.count !== 1) throw new AppError(409, 'This bill was just processed by another cashier. Refresh to see its latest status.');
      const data = await tx.paymentRequest.findUnique({ where: { id }, include });
      return { data: safeRecord(data), pickupPin: pin };
    });
  },
  async documentData(id, user, requirePaid = false) {
    const record = await this.get(id, user);
    if (requirePaid && !['PAID', 'FULFILLED'].includes(record.status)) throw new AppError(409, 'Payment must be completed before the receipt is available.');
    return { ...record, pickupPin: requirePaid ? decryptPickupPin(record.pickupPinEncrypted) : null };
  },
  async fulfillRetail(id, pickupPin, pharmacistId) {
    const request = await prisma.paymentRequest.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    if (!request || request.type !== 'RETAIL') throw new AppError(404, 'Retail payment request not found.');
    if (request.status !== 'PAID') throw new AppError(402, 'Cashier payment has not been completed for this retail request.');
    if (request.pinAttempts >= 5) throw new AppError(423, 'The receipt PIN is locked after too many failed attempts.');
    if (!verifyPickupPin(request.id, pickupPin, request.pickupPinHash)) {
      await prisma.paymentRequest.update({ where: { id }, data: { pinAttempts: { increment: 1 } } });
      throw new AppError(400, 'The receipt PIN is incorrect.');
    }
    return prisma.$transaction(async (tx) => {
      const claimed = await tx.paymentRequest.updateMany({ where: { id, type: 'RETAIL', status: 'PAID' }, data: { status: 'FULFILLED', pinVerifiedAt: new Date() } });
      if (claimed.count !== 1) throw new AppError(409, 'This retail order is already being processed or has been fulfilled by another staff member.');
      const now = new Date(); const saleItems = [];
      const operationSettings = await operationSettingsService.get(tx);
      const allocationOrder = batchAllocationOrder(operationSettings.allocationMethod);
      for (const requested of request.items) {
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: requested.productId } });
        const batches = await tx.inventoryBatch.findMany({ where: { productId: requested.productId, quantityAvailable: { gt: 0 }, expiryDate: { gte: now }, restricted: false }, orderBy: allocationOrder });
        const available = batches.reduce((sum, batch) => sum.add(batch.quantityAvailable), new Prisma.Decimal(0));
        if (available.lessThan(requested.quantity)) throw new AppError(409, `Insufficient usable stock for ${requested.product.genericName}.`);
        let left = requested.quantity;
        for (const batch of batches) {
          if (left.isZero()) break;
          const quantity = Prisma.Decimal.min(left, batch.quantityAvailable); const after = batch.quantityAvailable.sub(quantity);
          await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: after } });
          const lineTotal = requested.unitPrice.mul(quantity);
          saleItems.push({ productId: requested.productId, batchId: batch.id, quantity, unitPrice: requested.unitPrice, lineTotal });
          await tx.stockMovement.create({ data: { productId: requested.productId, batchId: batch.id, type: 'RETAIL_SALE', quantityChange: quantity.negated(), quantityBefore: batch.quantityAvailable, quantityAfter: after, referenceType: 'PAYMENT_REQUEST', referenceId: id, reason: 'Paid pharmacist retail handoff', performedById: pharmacistId } });
          left = left.sub(quantity);
        }
      }
      const sale = await tx.sale.create({ data: {
        invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`, patientId: request.patientId,
        pharmacistId, cashierId: request.cashierId, paymentRequestId: request.id, subtotal: request.subtotal, discount: request.discount, containerFee: request.containerFee,
        tax: request.tax, total: request.total, amountPaid: request.amountPaid, paymentMethod: request.paymentMethod, status: 'PAID',
        items: { create: saleItems },
      } });
      return sale;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  },
};
