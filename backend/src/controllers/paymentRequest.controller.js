import { z } from 'zod';
import { billingPreview } from '../utils/billingPreview.js';
import { paymentRequestService } from '../services/paymentRequest.service.js';
import { createPaymentRequestPdf } from '../utils/paymentRequestPdf.js';
import { recordAudit } from '../services/audit.service.js';
import { listPagination } from '../utils/listPagination.js';
import { AppError } from '../utils/AppError.js';

export const cashierPaymentSchema = z.object({
  confirmHandover: z.boolean().default(false),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']),
  paymentReference: z.string().trim().max(120).optional().nullable(),
  tenderedAmount: z.coerce.number().nonnegative().optional().nullable(),
  changeAmount: z.coerce.number().nonnegative().optional().nullable(),
  splitDetails: z.object({
    isSplit: z.boolean(),
    cashAmount: z.coerce.number().nonnegative(),
    nonCashMethod: z.enum(['CARD', 'BANK_TRANSFER']),
    nonCashAmount: z.coerce.number().nonnegative(),
    nonCashReference: z.string().trim().max(120).optional().nullable(),
    cashTendered: z.coerce.number().nonnegative().optional().nullable(),
    change: z.coerce.number().nonnegative().optional().nullable(),
  }).optional().nullable(),
});
export const retailPaymentRequestSchema = z.object({
  patientId: z.coerce.number().int().positive().optional().nullable(),
  couponCode: z.string().trim().max(40).optional().nullable(),
  tax: z.coerce.number().nonnegative().default(0),
  items: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().positive() })).min(1).max(100),
});
export const retailFulfillSchema = z.object({ pickupPin: z.string().regex(/^\d{6}$/).optional() });

export const paymentSlipSchema = z.object({
  originalName: z.string().trim().min(1).max(180),
  mimeType: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  fileBase64: z.string().min(8).max(3_600_000).regex(/^[A-Za-z0-9+/]+={0,2}$/, 'The uploaded slip is not valid base64 data.'),
  declaredAmount: z.coerce.number().positive().max(100_000_000),
  bankAccountId: z.coerce.number().int().positive().optional().nullable(),
  reference: z.string().trim().max(120).optional().nullable(),
  paidOn: z.coerce.date().refine((d) => d <= new Date(), 'The payment date cannot be in the future.').optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});
export const slipReviewSchema = z.object({
  approved: z.boolean(),
  verifiedAmount: z.coerce.number().positive().max(100_000_000).optional(),
  verifiedReference: z.string().trim().min(3).max(120).optional(),
  reason: z.string().trim().max(500).optional().nullable(),
}).superRefine((data, context) => {
  if (data.approved && (data.verifiedAmount == null || !data.verifiedReference)) context.addIssue({ code: 'custom', message: 'Record the amount and transaction reference verified against the bank.' });
  if (!data.approved && (!data.reason || data.reason.trim().length < 3)) {
    context.addIssue({ code: 'custom', path: ['reason'], message: 'Tell the customer why the slip was not accepted.' });
  }
});
export const declineInvoiceSchema = z.object({ revision: z.coerce.number().int().positive(), reason: z.string().trim().min(3).max(500) });
export const partialCancelSchema = z.object({
  quantities: z.record(z.string(), z.coerce.number().positive()).optional(),
  revision: z.coerce.number().int().positive(),
  itemIds: z.array(z.coerce.number().int().positive()).min(1),
  reason: z.string().trim().min(3).max(500),
  skipCustomerReconfirmation: z.boolean().optional().default(false),
});
export const requestCancellationSchema = z.object({ reason: z.string().trim().min(3).max(500) });
export const invoiceAcknowledgementSchema = z.object({
  revision: z.coerce.number().int().positive(),
  paymentChoice: z.enum(['CASH', 'BANK_TRANSFER']),
  customerNote: z.string().trim().max(500).optional().nullable(),
});
export const invoiceCouponSchema = z.object({
  revision: z.coerce.number().int().positive(),
  couponCode: z.string().trim().max(40).optional().nullable(),
});
import { protectWorkflowController } from '../middleware/workflowLease.js';
import { protectRetryController } from '../utils/operationContext.js';
export const paymentRequestController = protectRetryController(protectWorkflowController({
  preview: async (req,res) => {
    const bill = await paymentRequestService.get(Number(req.params.id),req.user);
    res.setHeader('Cache-Control','no-store');
    res.json({data:billingPreview(bill)});
  },
  collectionSlip: async (req, res) => {
    const data = await paymentRequestService.documentData(Number(req.params.id), req.user, true);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ data: { customerName: data.patient?.fullName || 'Walk-in customer', referenceNumber: data.requestNumber, pin: data.pickupPin, status: data.status, saleId: data.sale?.id || null, delivery: data.delivery || null, deliveryFee: Boolean(data.deliveryFeeFor) } });
  },
  resolveCancellation: async (req, res) => res.json({ data: await paymentRequestService.resolveCancellation(Number(req.params.id), req.body, req.user) }),
  changePaymentChoice: async (req, res) => res.json({ data: await paymentRequestService.acknowledge(Number(req.params.id), req.body, req.user, true) }),
  applyCoupon: async (req, res) => {
    const data = await paymentRequestService.applyPatientCoupon(Number(req.params.id), req.body, req.user);
    await recordAudit({ userId: req.user.id, action: 'CUSTOMER_INVOICE_COUPON_UPDATED', entityType: 'PAYMENT_REQUEST', entityId: data.id, details: { requestNumber: data.requestNumber, total: data.total, couponApplied: Boolean(data.couponCode) }, ipAddress: req.ip });
    res.json({ data });
  },
  list: async (req, res) => {
    const pagination = listPagination(req.query, ['AWAITING_PAYMENT', 'SLIP_SUBMITTED', 'PAID', 'FULFILLED', 'CANCELLED']);
    if (req.query.type) pagination.type = z.enum(['PRESCRIPTION', 'RETAIL']).parse(req.query.type);
    const data = await paymentRequestService.list(req.user, pagination);
    res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } });
  },
  create: async (req, res) => {
    const data = await paymentRequestService.create(Number(req.params.id), req.body, req.user.id);
    await recordAudit({
      userId: req.user.id, action: 'PAYMENT_REQUEST_CREATED', entityType: 'PAYMENT_REQUEST', entityId: data.id,
      details: {
        requestNumber: data.requestNumber, prescriptionId: data.prescriptionId, total: data.total,
        prescriptionItemCount: req.body.items.length, supplementaryRetailItemCount: req.body.retailItems?.length || 0,
      },
      ipAddress: req.ip,
    });
    res.status(201).json({ data });
  },
  update: async (req, res) => {
      const data = await paymentRequestService.update(Number(req.params.id), req.body, req.user.id);
    await recordAudit({
      userId: req.user.id, action: 'PAYMENT_REQUEST_UPDATED', entityType: 'PAYMENT_REQUEST', entityId: data.id,
      details: { requestNumber: data.requestNumber, prescriptionId: data.prescriptionId, total: data.total },
      ipAddress: req.ip,
    });
    res.json({ data });
  },
  cancel: async (req, res) => {
    const data = await paymentRequestService.cancel(Number(req.params.id), req.body.reason, req.user);
    await recordAudit({ userId: req.user.id, action: 'PAYMENT_REQUEST_CANCELLED', entityType: 'PAYMENT_REQUEST', entityId: data.id, details: { requestNumber: data.requestNumber, reason: req.body.reason }, ipAddress: req.ip });
    res.json({ data });
  },
  pay: async (req, res) => {
    const result = await paymentRequestService.pay(
      Number(req.params.id),
      req.body.paymentMethod,
      req.user.id,
      req.body.paymentReference,
      {
        confirmHandover: req.body.confirmHandover,
        tenderedAmount: req.body.tenderedAmount,
        changeAmount: req.body.changeAmount,
        splitDetails: req.body.splitDetails,
      }
    );
    await recordAudit({
      userId: req.user.id,
      action: 'CASHIER_PAYMENT_RECEIVED',
      entityType: 'PAYMENT_REQUEST',
      entityId: result.data.id,
      details: {
        requestNumber: result.data.requestNumber,
        total: result.data.total,
        paymentMethod: req.body.paymentMethod,
        paymentReference: req.body.paymentReference,
        tenderedAmount: req.body.tenderedAmount,
        changeAmount: req.body.changeAmount,
        splitDetails: req.body.splitDetails,
      },
      ipAddress: req.ip,
    });
    res.json(result);
  },
  acknowledge: async (req, res) => {
    const data = await paymentRequestService.acknowledge(Number(req.params.id), req.body, req.user);
    await recordAudit({
      userId: req.user.id, action: 'INVOICE_ACKNOWLEDGED', entityType: 'PAYMENT_REQUEST', entityId: data.id,
      details: { revision: req.body.revision, paymentChoice: req.body.paymentChoice, reservationExpiresAt: data.reservationExpiresAt },
      ipAddress: req.ip,
    });
    res.json({ data });
  },
  resetPickupPin: async (req, res) => {
    res.json(await paymentRequestService.resetPickupPin(Number(req.params.id), req.body.reason, req.user));
  },
  retailOptions: async (_req, res) => res.json({ data: await paymentRequestService.retailOptions() }),
  retailPatients: async (req, res) => res.json({ data: await paymentRequestService.retailPatients(req.query.search) }),
  createRetail: async (req, res) => {
    const data = await paymentRequestService.createRetail(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'RETAIL_PAYMENT_REQUEST_CREATED', entityType: 'PAYMENT_REQUEST', entityId: data.id, details: { requestNumber: data.requestNumber, total: data.total }, ipAddress: req.ip });
    res.status(201).json({ data });
  },
  fulfillRetail: async (req, res) => {
    const data = await paymentRequestService.fulfillRetail(Number(req.params.id), req.body.pickupPin, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'RETAIL_PIN_VERIFIED_AND_HANDED_OVER', entityType: 'PAYMENT_REQUEST', entityId: Number(req.params.id), details: { saleId: data.id, invoiceNumber: data.invoiceNumber }, ipAddress: req.ip });
    res.status(201).json({ data });
  },
  submitSlip: async (req, res) => {
    const data = await paymentRequestService.submitSlip(Number(req.params.id), req.body, req.user);
    await recordAudit({
      userId: req.user.id, action: 'PAYMENT_SLIP_SUBMITTED', entityType: 'PAYMENT_REQUEST', entityId: data.id,
      details: { requestNumber: data.requestNumber, declaredAmount: req.body.declaredAmount, reference: req.body.reference || null },
      ipAddress: req.ip,
    });
    res.status(201).json({ data });
  },
  reviewSlip: async (req, res) => {
    const result = await paymentRequestService.reviewSlip(Number(req.params.id), Number(req.params.slipId), req.body, req.user);
    await recordAudit({
      userId: req.user.id, action: req.body.approved ? 'PAYMENT_SLIP_VERIFIED' : 'PAYMENT_SLIP_REJECTED',
      entityType: 'PAYMENT_REQUEST', entityId: result.data.id,
      details: { requestNumber: result.data.requestNumber, slipId: Number(req.params.slipId), reason: req.body.reason || null },
      ipAddress: req.ip,
    });
    res.json(result);
  },
  slipFile: async (req, res) => {
    const slip = await paymentRequestService.slipFile(Number(req.params.id), Number(req.params.slipId), req.user);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `inline; filename="${slip.originalName}"`);
    res.type(slip.mimeType).send(slip.fileData);
  },
  decline: async (req, res) => {
    const data = await paymentRequestService.declineByPatient(Number(req.params.id), req.body.reason, req.user, req.body.revision);
    await recordAudit({
      userId: req.user.id, action: 'INVOICE_DECLINED_BY_PATIENT', entityType: 'PAYMENT_REQUEST', entityId: data.id,
      details: { requestNumber: data.requestNumber, reason: req.body.reason }, ipAddress: req.ip,
    });
    res.json({ data });
  },
  partialCancel: async (req, res) => {
    const data = await paymentRequestService.partialCancel(Number(req.params.id), req.body, req.user);
    await recordAudit({
      userId: req.user.id,
      action: 'PAYMENT_REQUEST_PARTIALLY_CANCELLED',
      entityType: 'PAYMENT_REQUEST',
      entityId: data.id,
      details: {
        cancelledItemIds: req.body.itemIds,
        reason: req.body.reason,
        refundAmount: data.refundAmount,
        customerReconfirmationSkipped: req.body.skipCustomerReconfirmation,
      },
      ipAddress: req.ip,
    });
    res.json({ data });
  },
  cancellationPreview: async (req, res) => res.json({ data: await paymentRequestService.cancellationPreview(Number(req.params.id), req.body, req.user) }),
  collectionsToday: async (_req, res) => res.json({ data: await paymentRequestService.collectionsToday() }),
  requestCancellation: async (req, res) => {
    const data = await paymentRequestService.requestCancellation(Number(req.params.id), req.body.reason, req.user);
    await recordAudit({
      userId: req.user.id,
      action: 'PAYMENT_REQUEST_CANCELLATION_REQUESTED',
      entityType: 'PAYMENT_REQUEST',
      entityId: data.id,
      details: { reason: req.body.reason },
      ipAddress: req.ip,
    });
    res.json({ data });
  },
  handoff: async (req, res) => {
    const data = await paymentRequestService.documentData(Number(req.params.id), req.user);
    res.setHeader('Content-Disposition', `inline; filename="${data.requestNumber}-cashier.pdf"`);
    res.type('application/pdf').send(await createPaymentRequestPdf(data, false));
  },
  receipt: async (req, res) => {
    const fullReceipt = req.query.format === 'full';
    if (fullReceipt && req.user.role === 'PATIENT') throw new AppError(403, 'Detailed cashier receipts can only be printed by pharmacy staff.');
    const data = await paymentRequestService.documentData(Number(req.params.id), req.user, true);
    res.setHeader('Content-Disposition', `inline; filename="${data.requestNumber}-${fullReceipt ? 'itemized-' : ''}receipt.pdf"`);
    res.setHeader('Cache-Control', 'no-store');
    res.type('application/pdf').send(await createPaymentRequestPdf(data, true, Number(req.query.width) === 58 ? 58 : 80, fullReceipt));
  },
}));
