import { prescriptionUploadService } from '../services/prescriptionUpload.service.js';
import { recordAudit } from '../services/audit.service.js';
import { listPagination } from '../utils/listPagination.js';

import { protectWorkflowController } from '../middleware/workflowLease.js';
export const prescriptionUploadController = protectWorkflowController({
  attachments: async (req, res) => res.json({ data: await prescriptionUploadService.attachments(Number(req.params.id), req.user) }),
  list: async (req, res) => { const pagination = listPagination(req.query, ['PENDING', 'AVAILABLE', 'PARTIALLY_AVAILABLE', 'UNAVAILABLE', 'REJECTED', 'QUOTE_SENT', 'QUOTE_ACCEPTED', 'PAYMENT_PENDING', 'AWAITING_PAYMENT', 'SLIP_SUBMITTED', 'PAID', 'FULFILLED', 'CANCELLED', 'PAYMENT_SUBMITTED', 'READY_TO_PREPARE']); const data = await prescriptionUploadService.list(req.user,pagination); res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } }); },
  create: async (req, res) => {
    const { replayed, ...data } = await prescriptionUploadService.create(req.body, req.user.id);
    if (!replayed) await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOADED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { fileName: data.originalName, prepareRequested: data.prepareRequested }, ipAddress: req.ip });
    res.status(replayed ? 200 : 201).json({ data, replayed: Boolean(replayed) });
  },
  file: async (req, res) => {
    const data = await prescriptionUploadService.file(Number(req.params.id), req.user, req.query.attachmentId ? Number(req.query.attachmentId) : undefined);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `inline; filename="${data.originalName}"`);
    res.type(data.mimeType).send(data.fileData);
  },
  review: async (req, res) => {
    const data = await prescriptionUploadService.review(Number(req.params.id), req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_REVIEWED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { status: data.status, estimatedTotal: data.estimatedTotal }, ipAddress: req.ip });
    res.json({ data });
  },
  edit: async (req, res) => {
    const data = await prescriptionUploadService.edit(Number(req.params.id), req.body, req.user);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_EDITED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id,
      details: { attachmentReplaced: Boolean(req.body.fileBase64), attachmentsAdded: req.body.additionalAttachments?.length || 0, removedAttachmentIds: req.body.removeAttachmentIds || [] }, ipAddress: req.ip });
    res.json({ data });
  },
  sendQuotation: async (req, res) => {
    const data = await prescriptionUploadService.sendQuotation(Number(req.params.id), req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_QUOTATION_SENT', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { estimatedTotal: data.estimatedTotal }, ipAddress: req.ip });
    res.json({ data });
  },
  estimateQuote: async (req, res) => {
    const data = await prescriptionUploadService.estimateQuote(Number(req.params.id), req.body);
    await recordAudit({
      userId: req.user.id,
      action: 'PRESCRIPTION_UPLOAD_ESTIMATE_CALCULATED',
      entityType: 'PRESCRIPTION_UPLOAD',
      entityId: data.uploadId,
      details: {
        itemCount: data.lines.length,
        medicineItemCount: data.medicineItemCount,
        retailItemCount: data.retailItemCount,
        subtotal: data.subtotal,
        discount: data.discount,
        containerFee: data.containerFee,
        tax: data.tax,
        total: data.total,
        allItemsInStock: data.allItemsInStock,
      },
      ipAddress: req.ip,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
    });
    res.json({ data });
  },
  acceptEstimate: async (req, res) => {
    const data = await prescriptionUploadService.acceptEstimate(Number(req.params.id), req.user.id, req.body.revision);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_ESTIMATE_ACCEPTED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, ipAddress: req.ip });
    res.json({ data });
  },
  proceedToOrder: async (req, res) => {
    const data = await prescriptionUploadService.proceedToOrder(Number(req.params.id), req.body, req.user);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_PROCESSING_REQUESTED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { deliveryRequested: Boolean(req.body.deliveryRequested), status: data.status }, ipAddress: req.ip });
    res.json({ data });
  },
  cancel: async (req, res) => {
    const data = await prescriptionUploadService.cancelByPatient(Number(req.params.id), req.body.reason, req.user);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_CANCELLED_BY_PATIENT', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { reason: req.body.reason }, ipAddress: req.ip });
    res.json({ data });
  },
  retention: async (_req, res) => res.json({ data: await prescriptionUploadService.retention() }),
  setRetention: async (req, res) => {
    const data = await prescriptionUploadService.setRetention(req.body.days);
    await recordAudit({ userId: req.user.id, action: 'UPLOAD_RETENTION_UPDATED', entityType: 'SYSTEM_SETTING', details: data, ipAddress: req.ip });
    res.json({ data });
  },
  setDeadline: async (req, res) => {
    const data = await prescriptionUploadService.setDeadline(Number(req.params.id), req.body.deleteAt);
    await recordAudit({ userId: req.user.id, action: 'UPLOAD_DELETION_DEADLINE_UPDATED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { deleteAt: data.deleteAt }, ipAddress: req.ip });
    res.json({ data });
  },

  // ── Payment slip endpoints ─────────────────────────────────────────────────

  submitSlip: async (req, res) => {
    const data = await prescriptionUploadService.submitSlip(Number(req.params.id), req.body, req.user);
    await recordAudit({
      userId: req.user.id, action: 'UPLOAD_PAYMENT_SLIP_SUBMITTED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id,
      details: { declaredAmount: req.body.declaredAmount, reference: req.body.reference || null },
      ipAddress: req.ip,
    });
    res.status(201).json({ data });
  },

  reviewSlip: async (req, res) => {
    const result = await prescriptionUploadService.reviewSlip(
      Number(req.params.id), Number(req.params.slipId), req.body, req.user,
    );
    await recordAudit({
      userId: req.user.id,
      action: req.body.approved ? 'UPLOAD_PAYMENT_SLIP_VERIFIED' : 'UPLOAD_PAYMENT_SLIP_REJECTED',
      entityType: 'PRESCRIPTION_UPLOAD', entityId: Number(req.params.id),
      details: { slipId: Number(req.params.slipId), reason: req.body.reason || null },
      ipAddress: req.ip,
    });
    res.json(result);
  },

  slipFile: async (req, res) => {
    const slip = await prescriptionUploadService.slipFile(
      Number(req.params.id), Number(req.params.slipId), req.user,
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `inline; filename="${slip.originalName}"`);
    res.type(slip.mimeType).send(slip.fileData);
  },
});
