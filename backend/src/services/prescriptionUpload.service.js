import { serializable } from '../utils/serializable.js';
import { invoiceMaterialChanged } from '../utils/invoiceRevision.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { Prisma } from '@prisma/client';
import { assertCouponMatched, calculateDiscounts } from './discount.service.js';
import { ageOnDate } from '../utils/age.js';
import { findAgeUnsuitable } from '../utils/ageSuitability.js';
import { usableStockTotal } from '../utils/stock.js';

const slipSelect = {
  id: true, status: true, declaredAmount: true, reference: true, paidOn: true, note: true,
  originalName: true, mimeType: true, rejectionReason: true, reviewedAt: true, createdAt: true,
  uploadedBy: { select: { id: true, fullName: true } },
  reviewedBy: { select: { id: true, fullName: true } },
  bankAccount: { select: { id: true, bankName: true, accountNumber: true } },
};

const summarySelect = {
  id: true, originalName: true, mimeType: true, patientNote: true, prepareRequested: true, orderedForSelf: true, recipientName: true, recipientRelationship: true, recipientDateOfBirth: true, recipientAllergies: true, recipientConditions: true, status: true, availabilityNotes: true,
  estimatedTotal: true, estimateDetails: true, reviewedAt: true, createdAt: true, updatedAt: true, deleteAt: true, attachmentRemovedAt: true,
  quoteRevision: true, acknowledgedQuoteRevision: true, quoteSentAt: true, quoteAcknowledgedAt: true,
  patient: { select: { id: true, fullName: true, email: true, patientProfile: { select: { id: true, patientNumber: true } } } },
  reviewedBy: { select: { id: true, fullName: true, role: true } },
  prescription: { select: { id: true, prescriptionNumber: true, status: true, paymentRequest: { select: { status: true, revision: true, acknowledgedRevision: true, customerPaymentChoice: true, reservationExpiresAt: true } }, items: { select: { id: true, dosageInstructions: true, frequency: true, duration: true, prescribedQuantity: true, product: { select: { genericName: true, strength: true, unit: true, storageInstructions: true } } } } } },
  paymentSlips: { select: slipSelect, orderBy: { createdAt: 'desc' } },
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
  const unsuitable = findAgeUnsuitable(products, age);
  if (unsuitable.length) throw new AppError(400, `${unsuitable.map((product) => product.genericName).join(', ')} ${unsuitable.length === 1 ? 'is' : 'are'} outside the configured age range for this medicine recipient (${age} years). Review the medicine or update its verified age guidance.`);
};

export const prescriptionUploadService = {
  async cleanupExpired(db = prisma) {
    // Retention applies to the attachment, not order/payment history. Active
    // preparation and unresolved payments keep their source evidence available.
    const result = await db.prescriptionUpload.updateMany({
      where: {
        deleteAt: { lte: new Date() }, attachmentRemovedAt: null,
        paymentSlips: { none: { status: 'PENDING' } },
        OR: [
          { prescription: { is: null }, status: { notIn: ['QUOTE_ACCEPTED', 'READY_TO_PREPARE', 'PAYMENT_PENDING', 'PAYMENT_SUBMITTED'] }, paymentSlips: { none: { status: { in: ['PENDING', 'VERIFIED'] } } } },
          { prescription: { is: { status: { in: ['DISPENSED', 'REJECTED', 'CANCELLED'] }, OR: [{ paymentRequest: { is: null } }, { paymentRequest: { is: { status: { in: ['FULFILLED', 'CANCELLED'] } } } }] } } },
        ],
      },
      data: { fileData: Buffer.alloc(0), attachmentRemovedAt: new Date() },
    });
    return result.count;
  },
  async retention() { const setting = await prisma.systemSetting.findUnique({ where: { key: 'prescriptionUploadRetentionDays' } }); return { days: Number(setting?.value || 30) }; },
  async setRetention(days) { await prisma.systemSetting.upsert({ where: { key: 'prescriptionUploadRetentionDays' }, update: { value: String(days) }, create: { key: 'prescriptionUploadRetentionDays', value: String(days) } }); return { days }; },
  async list(user, { page = 1, pageSize = 300 } = {}) { await this.cleanupExpired(); return prisma.prescriptionUpload.findMany({
    where: user.role === 'PATIENT' ? { patientId: user.id } : {}, select: summarySelect,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize,
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
      recipientAllergies: data.orderedForSelf ? null : (data.recipientAllergies || null),
      recipientConditions: data.orderedForSelf ? null : (data.recipientConditions || null),
      deleteAt,
    }, select: summarySelect });
  },
  async file(id, user) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, patientId: true, originalName: true, mimeType: true, fileData: true } });
    ensureAccess(record, user);
    if (!record.fileData?.length) throw new AppError(410, 'This attachment was removed under the retention policy. The order and payment history are still available.');
    return record;
  },
  async review(id, data, userId) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, status: true, attachmentRemovedAt: true } });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    if (record.attachmentRemovedAt) throw new AppError(410, 'This attachment has expired. Ask the customer to submit it again.');
    if (record.status !== 'PENDING') throw new AppError(409, 'This uploaded prescription has already been processed by another staff member. Refresh to see its latest status.');
    const claimed = await prisma.prescriptionUpload.updateMany({ where: { id, status: 'PENDING' }, data: {
      status: data.status, availabilityNotes: data.availabilityNotes || null, estimatedTotal: ['UNAVAILABLE', 'REJECTED'].includes(data.status) ? null : data.estimatedTotal,
      reviewedById: userId, reviewedAt: new Date(),
    } });
    if (claimed.count !== 1) throw new AppError(409, 'This uploaded prescription was just processed by another staff member. Refresh to see its latest status.');
    return prisma.prescriptionUpload.findUnique({ where: { id }, select: summarySelect });
  },
  // Pharmacist finalises the estimate and sends the quotation — moves status to PAYMENT_PENDING
  async sendQuotation(id, userId) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, status: true, estimatedTotal: true, quoteRevision: true } });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    if (!['AVAILABLE', 'PARTIALLY_AVAILABLE'].includes(record.status)) throw new AppError(409, 'The upload must be marked as available before sending the quotation.');
    if (record.estimatedTotal == null) throw new AppError(409, 'Calculate and save an estimated invoice before sending the quotation.');
    const sent = await prisma.prescriptionUpload.updateMany({ where: { id, status: record.status, quoteRevision: record.quoteRevision, prescription: { is: null } }, data: {
      status: 'QUOTE_SENT', reviewedById: userId, reviewedAt: new Date(), quoteSentAt: new Date(),
      acknowledgedQuoteRevision: null, quoteAcknowledgedAt: null,
    } });
    if (sent.count !== 1) throw new AppError(409, 'The quotation changed. Refresh before sending it.');
    return prisma.prescriptionUpload.findUnique({ where: { id }, select: summarySelect });
  },
  async estimateQuote(id, data) {
    const upload = await prisma.prescriptionUpload.findUnique({
      where: { id },
      select: { id: true, patientId: true, orderedForSelf: true, recipientDateOfBirth: true, status: true, quoteRevision: true, estimateDetails: true, prescription: { select: { id: true } } },
    });
    if (!upload) throw new AppError(404, 'Uploaded prescription not found.');
    if (upload.prescription) throw new AppError(409, 'The final prescription has already been created. Edit the final invoice instead of the rough quotation.');

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
        select: { quantityAvailable: true, quantityReserved: true },
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
      const quantity = stockQuantity(requested.quantity, product.unit);
      const availableQuantity = usableStockTotal(product.batches);
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
    const discountResult = assertCouponMatched(await calculateDiscounts(
      prisma,
      allocations,
      subtotal,
      data.couponCode,
    ));
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
    if (upload.estimateDetails?.quote && !invoiceMaterialChanged(
      { ...upload.estimateDetails.quote, couponCode: upload.estimateDetails.input?.couponCode },
      { ...quote, couponCode: data.couponCode },
    )) return quote;
    const saved = await prisma.prescriptionUpload.updateMany({
      where: { id: upload.id, status: upload.status, quoteRevision: upload.quoteRevision, prescription: { is: null } },
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
        quoteRevision: { increment: 1 },
        acknowledgedQuoteRevision: null,
        quoteAcknowledgedAt: null,
        ...(upload.status === 'QUOTE_SENT' || upload.status === 'QUOTE_ACCEPTED'
          ? { status: quote.allMedicinesInStock ? 'AVAILABLE' : 'PARTIALLY_AVAILABLE' }
          : {}),
      },
    });
    if (saved.count !== 1) throw new AppError(409, 'The quotation changed or was converted into a final invoice. Refresh before editing.');
    return quote;
  },
  async acceptEstimate(id, userId, revision) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, patientId: true, status: true, prepareRequested: true, estimatedTotal: true, quoteRevision: true } });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    if (record.patientId !== userId) throw new AppError(403, 'This uploaded prescription does not belong to you.');
    if (record.status !== 'QUOTE_SENT' || record.estimatedTotal == null) throw new AppError(409, 'The latest quotation is not awaiting your approval.');
    if (revision !== record.quoteRevision) throw new AppError(409, 'The quotation has changed. Refresh and review the latest quotation.');
    const accepted = await prisma.prescriptionUpload.updateMany({ where: { id, patientId: userId, status: 'QUOTE_SENT', quoteRevision: revision }, data: {
      prepareRequested: true, status: 'QUOTE_ACCEPTED', acknowledgedQuoteRevision: record.quoteRevision, quoteAcknowledgedAt: new Date(),
    } });
    if (accepted.count !== 1) throw new AppError(409, 'The quotation has changed. Refresh and review it again.');
    return prisma.prescriptionUpload.findUnique({ where: { id }, select: summarySelect });
  },
  async cancelByPatient(id, reason, user) {
    const upload = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true, patientId: true, status: true, prescription: { select: { id: true } } } });
    if (!upload) throw new AppError(404, 'Uploaded prescription not found.');
    if (user.role === 'PATIENT' && upload.patientId !== user.id) {
      throw new AppError(403, 'This prescription does not belong to you.');
    }
    if (['UNAVAILABLE', 'REJECTED'].includes(upload.status)) {
      throw new AppError(409, 'This upload is already cancelled or rejected.');
    }
    if (upload.prescription) {
      throw new AppError(409, 'This upload has already been converted into a prescription. Use the prescription cancellation workflow instead.');
    }
    if (upload.status === 'READY_TO_PREPARE') {
      throw new AppError(409, 'Your payment has already been verified and medicines are being prepared. Contact the pharmacy directly to request cancellation.');
    }
    const cancelled = await prisma.prescriptionUpload.updateMany({
      where: { id, status: upload.status, prescription: { is: null } },
      data: {
        status: 'REJECTED',
        availabilityNotes: `Declined / Cancelled by customer: ${reason}`,
      },
    });
    if (cancelled.count !== 1) throw new AppError(409, 'This upload changed or was converted into a final invoice. Refresh before cancelling.');
    return prisma.prescriptionUpload.findUnique({ where: { id }, select: summarySelect });
  },
  async setDeadline(id, deleteAt) {
    const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { id: true } });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    return prisma.prescriptionUpload.update({ where: { id }, data: { deleteAt }, select: summarySelect });
  },

  // ── Bank-transfer payment slip workflow ──────────────────────────────────────

  // Patient submits a bank-transfer slip
  async submitSlip(id, data, user) {
    return serializable(async (tx) => {
      const linked = await tx.prescription.findFirst({ where: { sourceUploadId: id }, select: { id: true } });
      if (linked) throw new AppError(409, 'A final invoice already exists. Submit or review bank transfers from Sales & billing for that invoice.');
    const record = await tx.prescriptionUpload.findUnique({
      where: { id },
      select: { id: true, patientId: true, status: true, estimatedTotal: true },
    });
    if (!record) throw new AppError(404, 'Uploaded prescription not found.');
    if (user.role === 'PATIENT' && record.patientId !== user.id) throw new AppError(403, 'This uploaded prescription does not belong to you.');
    if (!['PAYMENT_PENDING', 'PAYMENT_SUBMITTED'].includes(record.status)) {
      throw new AppError(409, `A payment slip can only be submitted after the pharmacy sends you a quotation. Current status: ${record.status}.`);
    }
    const fileData = Buffer.from(data.fileBase64, 'base64');
    if (!fileData.length || fileData.length > 2_500_000) throw new AppError(413, 'Payment slip files must be 2.5 MB or smaller.');
    if (!validSignature(fileData, data.mimeType)) throw new AppError(400, 'The file content does not match the selected file type.');

    await Promise.all([
      tx.uploadPaymentSlip.create({
        data: {
          uploadId: id,
          uploadedById: user.id,
          bankAccountId: data.bankAccountId || null,
          originalName: data.originalName.replace(/[\\/\r\n"]/g, '_'),
          mimeType: data.mimeType,
          fileData,
          declaredAmount: data.declaredAmount,
          reference: data.reference || null,
          paidOn: data.paidOn || null,
          note: data.note || null,
        },
      }),
      tx.prescriptionUpload.update({
        where: { id },
        data: { status: 'PAYMENT_SUBMITTED' },
      }),
    ]);
    return tx.prescriptionUpload.findUnique({ where: { id }, select: summarySelect });
    });
  },

  // Cashier reviews a slip — approves (READY_TO_PREPARE) or rejects (PAYMENT_PENDING)
  async reviewSlip(uploadId, slipId, data, user) {
    return serializable(async (tx) => {
      const linked = await tx.prescription.findFirst({ where: { sourceUploadId: uploadId }, select: { id: true } });
      if (linked) throw new AppError(409, 'A final invoice already exists. Submit or review bank transfers from Sales & billing for that invoice.');
    const slip = await tx.uploadPaymentSlip.findUnique({
      where: { id: slipId },
      select: { id: true, uploadId: true, status: true },
    });
    if (!slip || slip.uploadId !== uploadId) throw new AppError(404, 'Payment slip not found.');
    if (slip.status !== 'PENDING') throw new AppError(409, 'This slip has already been reviewed.');

    const claimed = await tx.uploadPaymentSlip.updateMany({
      where: { id: slipId, status: 'PENDING' },
      data: {
        status: data.approved ? 'VERIFIED' : 'REJECTED',
        reviewedById: user.id,
        reviewedAt: new Date(),
        rejectionReason: data.approved ? null : data.reason,
      },
    });
    if (claimed.count !== 1) throw new AppError(409, 'This slip was just reviewed by another staff member. Refresh to see its latest status.');

    // Advance or revert the upload status
    await tx.prescriptionUpload.update({
      where: { id: uploadId },
      data: { status: data.approved ? 'READY_TO_PREPARE' : 'PAYMENT_PENDING' },
    });

    return {
      upload: await tx.prescriptionUpload.findUnique({ where: { id: uploadId }, select: summarySelect }),
    };
    });
  },

  // Serve the slip image/PDF file
  async slipFile(uploadId, slipId, user) {
    const slip = await prisma.uploadPaymentSlip.findUnique({
      where: { id: slipId },
      select: {
        id: true, uploadId: true, originalName: true, mimeType: true, fileData: true,
        upload: { select: { patientId: true } },
      },
    });
    if (!slip || slip.uploadId !== uploadId) throw new AppError(404, 'Payment slip not found.');
    if (user.role === 'PATIENT' && slip.upload.patientId !== user.id) throw new AppError(403, 'Access denied.');
    return slip;
  },
};
