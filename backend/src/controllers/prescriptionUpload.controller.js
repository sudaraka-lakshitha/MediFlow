import { prescriptionUploadService } from '../services/prescriptionUpload.service.js';
import { recordAudit } from '../services/audit.service.js';

export const prescriptionUploadController = {
  list: async (req, res) => res.json({ data: await prescriptionUploadService.list(req.user) }),
  create: async (req, res) => {
    const data = await prescriptionUploadService.create(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOADED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { fileName: data.originalName, prepareRequested: data.prepareRequested }, ipAddress: req.ip });
    res.status(201).json({ data });
  },
  file: async (req, res) => {
    const data = await prescriptionUploadService.file(Number(req.params.id), req.user);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `inline; filename="${data.originalName}"`);
    res.type(data.mimeType).send(data.fileData);
  },
  review: async (req, res) => {
    const data = await prescriptionUploadService.review(Number(req.params.id), req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_REVIEWED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, details: { status: data.status, estimatedTotal: data.estimatedTotal }, ipAddress: req.ip });
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
    const data = await prescriptionUploadService.acceptEstimate(Number(req.params.id), req.user.id);
    await recordAudit({ userId: req.user.id, action: 'PRESCRIPTION_UPLOAD_ESTIMATE_ACCEPTED', entityType: 'PRESCRIPTION_UPLOAD', entityId: data.id, ipAddress: req.ip });
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
};
