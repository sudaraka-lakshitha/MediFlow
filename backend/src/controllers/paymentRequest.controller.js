import { z } from 'zod';
import { paymentRequestService } from '../services/paymentRequest.service.js';
import { createPaymentRequestPdf } from '../utils/paymentRequestPdf.js';
import { recordAudit } from '../services/audit.service.js';

export const cashierPaymentSchema = z.object({ paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']), paymentReference: z.string().trim().max(120).optional().nullable() });
export const retailPaymentRequestSchema = z.object({
  patientId: z.coerce.number().int().positive().optional().nullable(),
  couponCode: z.string().trim().max(40).optional().nullable(),
  tax: z.coerce.number().nonnegative().default(0),
  items: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().positive() })).min(1).max(100),
});
export const retailFulfillSchema = z.object({ pickupPin: z.string().regex(/^\d{6}$/) });
export const paymentRequestController = {
  list: async (req, res) => res.json({ data: await paymentRequestService.list(req.user) }),
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
    const data = await paymentRequestService.update(Number(req.params.id), req.body);
    await recordAudit({
      userId: req.user.id, action: 'PAYMENT_REQUEST_UPDATED', entityType: 'PAYMENT_REQUEST', entityId: data.id,
      details: { requestNumber: data.requestNumber, prescriptionId: data.prescriptionId, total: data.total },
      ipAddress: req.ip,
    });
    res.json({ data });
  },
  cancel: async (req, res) => {
    const data = await paymentRequestService.cancel(Number(req.params.id), req.body.reason, req.user.id, req.user.role);
    await recordAudit({ userId: req.user.id, action: 'PAYMENT_REQUEST_CANCELLED', entityType: 'PAYMENT_REQUEST', entityId: data.id, details: { requestNumber: data.requestNumber, reason: req.body.reason }, ipAddress: req.ip });
    res.json({ data });
  },
  pay: async (req, res) => {
    const result = await paymentRequestService.pay(Number(req.params.id), req.body.paymentMethod, req.user.id, req.body.paymentReference);
    await recordAudit({ userId: req.user.id, action: 'CASHIER_PAYMENT_RECEIVED', entityType: 'PAYMENT_REQUEST', entityId: result.data.id, details: { requestNumber: result.data.requestNumber, total: result.data.total, paymentMethod: req.body.paymentMethod }, ipAddress: req.ip });
    res.json(result);
  },
  retailOptions: async (_req, res) => res.json({ data: await paymentRequestService.retailOptions() }),
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
  handoff: async (req, res) => {
    const data = await paymentRequestService.documentData(Number(req.params.id), req.user);
    res.setHeader('Content-Disposition', `inline; filename="${data.requestNumber}-cashier.pdf"`);
    res.type('application/pdf').send(await createPaymentRequestPdf(data, false));
  },
  receipt: async (req, res) => {
    const data = await paymentRequestService.documentData(Number(req.params.id), req.user, true);
    res.setHeader('Content-Disposition', `inline; filename="${data.requestNumber}-receipt.pdf"`);
    res.type('application/pdf').send(await createPaymentRequestPdf(data, true));
  },
};
