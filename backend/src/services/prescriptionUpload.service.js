import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { Prisma } from '@prisma/client';
import { calculateDiscounts } from './discount.service.js';
import { ageOnDate } from '../utils/age.js';

const summarySelect = {
  id: true, originalName: true, mimeType: true, patientNote: true, prepareRequested: true, orderedForSelf: true, recipientName: true, recipientRelationship: true, recipientDateOfBirth: true, status: true, availabilityNotes: true,
  estimatedTotal: true, estimateDetails: true, reviewedAt: true, createdAt: true, updatedAt: true, deleteAt: true,
  patient: { select: { id: true, fullName: true, email: true, patientProfile: { select: { id: true, patientNumber: true } } } },
  reviewedBy: { select: { id: true, fullName: true, role: true } },
  prescription: { select: { id: true, prescriptionNumber: true, status: true } },
};

const validSignature = (buffer, mimeType) => {
  if (mimeType === 'application/pdf') return buffer.subarray(0, 4).toString() === '%PDF';
  if (mimeType === 'image/png') return buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
  if (mimeType === 'image/jpeg') return buffer.subarray(0, 3).toString('hex') === 'ffd8ff';
  if (mimeType === 'image/webp') return buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
  if (mimeType === 'text/plain') return buffer.length > 0 && !buffer.includes(0);
  return false;
};

const ensureAccess = (record, user) => {
  if (!record) throw new AppError(404, 'Uploaded prescription not found.');
  if (user.role === 'PATIENT' && record.patientId !== user.id) throw new AppError(403, 'This uploaded prescription does not belong to you.');
};
const isLiquidProduct = (product) =>
  ['ml', 'millilitre', 'milliliter', 'l', 'litre', 'liter'].includes(String(product?.unit || '').toLowerCase())
  || /syrup|suspension|solution|elixir|liquid/i.test(String(product?.dosageForm || ''));

const validateRecipientAge = async (upload, products) => {
  let dateOfBirth = upload.recipientDateOfBirth;
  if (upload.orderedForSelf) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId: upload.patientId }, select: { dateOfBirth: true } });
    dateOfBirth = patient?.dateOfBirth;
  }
  if (!dateOfBirth) {
    throw new AppError(400, upload.orderedForSelf
      ? 'Record the patient date of birth before quoting medicine so age suitability can be checked.'
      : 'Record the recipient date of birth so medicine age suitability can be checked.');
  }
  const age = ageOnDate(dateOfBirth, new Date());
  if (age < 0 || age > 130) throw new AppError(400, 'The medicine recipient date of birth is invalid.');
  const unsuitable = products.filter((product) => (product.minimumAgeYears != null && age < product.minimumAgeYears) || (product.maximumAgeYears != null && age > product.maximumAgeYears));
  if (unsuitable.length) throw new AppError(400, `${unsuitable.map((product) => product.genericName).join(', ')} ${unsuitable.length === 1 ? 'is' : 'are'} outside the configured age range for this medicine recipient (${age} years). Review the medicine or update its verified age guidance.`);
};

export const prescriptionUploadService = {
  async cleanupExpired() { const result = await prisma.prescriptionUpload.deleteMany({ where: { deleteAt: { lte: new Date() } } }); return result.count; },
  async retention() { const setting = await prisma.systemSetting.findUnique({ where: { key: 'prescriptionUploadRetentionDays' } }); return { days: Number(setting?.value || 30) }; },
  async setRetention(days) { await prisma.systemSetting.upsert({ where: { key: 'prescriptionUploadRetentionDays' }, update: { value: String(days) }, create: { key: 'prescriptionUploadRetentionDays', value: String(days) } }); return { days }; },
  async list(user) { await this.cleanupExpired(); return prisma.prescriptionUpload.findMany({
    where: user.role === 'PATIENT' ? { patientId: user.id } : {}, select: summarySelect,
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }], take: 300,
  }); },
  async create(data, userId) {
    const fileData = Buffer.from(data.fileBase64, 'base64');
    if (!fileData.length || fileData.length > 2_500_000) throw new AppError(413, 'Prescription files must be 2.5 MB or smaller.');
    if (!validSignature(fileData, data.mimeType)) throw new AppError(400, 'The file content does not match the selected PDF or image type.');
    const retention = await this.retention(); const deleteAt = new Date(); deleteAt.setDate(deleteAt.getDate() + retention.days);
    return prisma.prescriptionUpload.create({ data: {
      patientId: userId, originalName: data.originalName.replace(/[\\/\r\n"]/g, '_'), mimeType: data.mimeType,
      fileData, patientNote: data.patientNote || null, prepareRequested: data.prepareRequested,
      orderedForSelf: data.orderedForSelf, recipientName: data.orderedForSelf ? null : data.recipientName,
      recipientRelationship: data.orderedForSelf ? null : data.recipientRelationship,
      recipientDateOfBirth: data.orderedForSelf ? null : data.recipientDateOfBirth,
      deleteAt,
    }, select: summarySelect });
  },
  async file(id, user) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, patientId: true, originalName: true, mimeType: true, fileData: true } });
    ensureAccess(record, user); return record;
  },
  async review(id, data, userId) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    if (record.status !== 'PENDING') throw new AppError(409, 'This uploaded prescription has already been processed by another staff member. Refresh to see its latest status.');
    const claimed = await prisma.prescriptionUpload.updateMany({ where: { id, status: 'PENDING' }, data: {
      status: data.status, availabilityNotes: data.availabilityNotes || null, estimatedTotal: ['UNAVAILABLE', 'REJECTED'].includes(data.status) ? null : data.estimatedTotal,
      reviewedById: userId, reviewedAt: new Date(),
    } });
    if (claimed.count !== 1) throw new AppError(409, 'This uploaded prescription was just processed by another staff member. Refresh to see its latest status.');
    return prisma.prescriptionUpload.findUnique({ where: { id }, select: summarySelect });
  },
  async estimateQuote(id, data) {
    const upload = await prisma.prescriptionUpload.findUnique({
      where: { id },
      select: { id: true, patientId: true, orderedForSelf: true, recipientDateOfBirth: true },
    });
    if (!upload) throw new AppError(404, 'Uploaded prescription not found.');

    const requestedIds = [...new Set(data.items.map((item) => item.productId))];
    const requestedRetailIds = [...new Set((data.retailItems || []).map((item) => item.productId))];
    const now = new Date();
    const productInclude = {
      category: true,
      batches: {
        where: {
          quantityAvailable: { gt: 0 },
          restricted: false,
          expiryDate: { gte: now },
        },
        select: { quantityAvailable: true },
      },
    };
    const [products, retailProducts] = await Promise.all([
      prisma.product.findMany({
        where: {
          id: { in: requestedIds },
          active: true,
          productType: 'MEDICINE',
        },
        include: productInclude,
      }),
      requestedRetailIds.length ? prisma.product.findMany({
        where: {
          id: { in: requestedRetailIds },
          active: true,
          prescriptionRequired: false,
        },
        include: productInclude,
      }) : [],
    ]);
    if (products.length !== requestedIds.length) {
      throw new AppError(400, 'One or more selected medicines are inactive, unavailable, or not medicinal products.');
    }
    if (retailProducts.length !== requestedRetailIds.length) {
      throw new AppError(400, 'One or more selected retail items are inactive, unavailable, or require a prescription.');
    }
    if (products.length) {
      await validateRecipientAge(upload, products);
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const retailProductById = new Map(retailProducts.map((product) => [product.id, product]));
    let subtotal = new Prisma.Decimal(0);
    const allocations = [];
    const createLine = (requested, product, source) => {
      const quantity = new Prisma.Decimal(requested.quantity);
      const availableQuantity = product.batches.reduce(
        (sum, batch) => sum.add(batch.quantityAvailable),
        new Prisma.Decimal(0),
      );
      const lineTotal = product.sellingPrice.mul(quantity).toDecimalPlaces(2);
      subtotal = subtotal.add(lineTotal);
      allocations.push({
        productId: product.id,
        categoryId: product.categoryId,
        quantity,
        unitPrice: product.sellingPrice,
        lineTotal,
      });
      return {
        source,
        productId: product.id,
        sku: product.sku,
        name: `${product.genericName}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`,
        unit: product.unit,
        quantity: Number(quantity),
        availableQuantity: Number(availableQuantity),
        sufficientStock: availableQuantity.greaterThanOrEqualTo(quantity),
        unitPrice: Number(product.sellingPrice),
        lineTotal: Number(lineTotal),
      };
    };
    const medicineLines = data.items.map((requested) => createLine(requested, productById.get(requested.productId), 'PRESCRIPTION'));
    const retailLines = (data.retailItems || []).map((requested) => createLine(requested, retailProductById.get(requested.productId), 'RETAIL'));
    const lines = [...medicineLines, ...retailLines];

    subtotal = subtotal.toDecimalPlaces(2);
    const discountResult = await calculateDiscounts(
      prisma,
      allocations,
      subtotal,
      data.couponCode,
    );
    const hasLiquidMedicine = products.some(isLiquidProduct);
    const containerFee = new Prisma.Decimal(data.containerFee || 0).toDecimalPlaces(2);
    if (containerFee.greaterThan(0) && !hasLiquidMedicine) {
      throw new AppError(400, 'Bottle or container fees can be added only when the estimate contains a liquid medicine.');
    }
    const tax = new Prisma.Decimal(data.tax).toDecimalPlaces(2);
    const total = Prisma.Decimal.max(
      0,
      subtotal.sub(discountResult.amount).add(containerFee).add(tax),
    ).toDecimalPlaces(2);
    const quote = {
      uploadId: upload.id,
      lines,
      subtotal: Number(subtotal),
      discount: Number(discountResult.amount),
      appliedDiscounts: discountResult.applications.map((application) => ({
        ...application,
        ruleValue: Number(application.ruleValue),
        amount: Number(application.amount),
      })),
      containerFee: Number(containerFee),
      tax: Number(tax),
      total: Number(total),
      allItemsInStock: lines.every((line) => line.sufficientStock),
      allMedicinesInStock: medicineLines.every((line) => line.sufficientStock),
      medicineItemCount: medicineLines.length,
      retailItemCount: retailLines.length,
      quotedAt: new Date().toISOString(),
    };
    await prisma.prescriptionUpload.update({
      where: { id: upload.id },
      data: {
        estimatedTotal: total,
        estimateDetails: {
          input: {
            items: data.items,
            retailItems: data.retailItems || [],
            couponCode: data.couponCode || null,
            containerFee: Number(containerFee),
            bottleCount: data.bottleCount,
            bottleFeePerBottle: data.bottleFeePerBottle,
            tax: Number(tax),
          },
          quote,
          savedAt: new Date().toISOString(),
        },
      },
    });
    return quote;
  },
  async setDeadline(id, deleteAt) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true } });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    return prisma.prescriptionUpload.update({ where: { id }, data: { deleteAt }, select: summarySelect });
  },
};
