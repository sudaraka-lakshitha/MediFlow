import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { withWorkflowLease } from '../middleware/workflowLease.js';
import { idParams } from '../validators/common.validator.js';
import { deliveryService } from '../services/delivery.service.js';
import { listPagination } from '../utils/listPagination.js';
import { deliveryActionSchema, deliveryContactSchema, deliveryFilterSchema } from '../validators/delivery.validator.js';
import { deliveryBulkSchema, deliveryBulkService } from '../services/deliveryBulk.service.js';
import { workflowLeaseService } from '../services/workflowLease.service.js';
import { exportDeliveryWorkbook, readDeliveryWorkbook } from '../services/deliveryWorkbook.service.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
export const deliveryRoutes = Router();
// Authenticate only matching delivery routes; leave login and registration public.
deliveryRoutes.use(['/deliveries', '/delivery-settings', '/payment-requests/:id/delivery'], authenticate);
deliveryRoutes.post('/deliveries/export.xlsx', authorize('ADMIN', 'PHARMACIST'), validate({ body: z.object({ ids: z.array(z.number().int().positive()).max(500).default([]) }) }), asyncHandler(async (req, res) => {
  const ids = req.body?.ids || [];
  const rows = ids.length
    ? await prisma.deliveryRequest.findMany({ where: { id: { in: ids } }, include: { paymentRequest: { select: { requestNumber: true, patient: { select: { fullName: true } } } } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] })
    : [];
  const buffer = await exportDeliveryWorkbook(rows);
  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.set('Content-Disposition', 'attachment; filename="mediflow-deliveries.xlsx"');
  res.set('Cache-Control', 'no-store'); res.send(Buffer.from(buffer));
}));
deliveryRoutes.post('/deliveries/bulk/excel-preview', authorize('ADMIN', 'PHARMACIST'), validate({ body: z.object({ fileBase64: z.string().min(8).max(1_340_000).regex(/^[A-Za-z0-9+/]+={0,2}$/) }) }), asyncHandler(async (req, res) => {
  const rows = await readDeliveryWorkbook(Buffer.from(req.body.fileBase64, 'base64'));
  res.json({ data: { ...await deliveryBulkService.preview(rows, req.user), rows } });
}));
deliveryRoutes.post('/deliveries/bulk/preview', authorize('ADMIN', 'PHARMACIST'), validate({ body: deliveryBulkSchema }), asyncHandler(async (req, res) => {
  res.json({ data: await deliveryBulkService.preview(req.body.rows, req.user) });
}));
deliveryRoutes.post('/deliveries/bulk/confirm', authorize('ADMIN', 'PHARMACIST'), validate({ body: deliveryBulkSchema }), asyncHandler(async (req, res) => {
  res.json({ data: await deliveryBulkService.apply(req.body.rows, req.body.previewToken, req.user, workflowLeaseService.owner(req)) });
}));
deliveryRoutes.get('/deliveries', authorize('PATIENT', 'ADMIN', 'PHARMACIST', 'CASHIER'), asyncHandler(async (req, res) => {
  const pagination = listPagination(req.query); const data = await deliveryService.list(req.user, { ...pagination, ...deliveryFilterSchema.parse(req.query) });
  res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } });
}));
deliveryRoutes.get('/deliveries/couriers', authorize('PATIENT', 'ADMIN', 'PHARMACIST', 'CASHIER'), asyncHandler(async (req, res) => {
  res.json({ data: await deliveryService.couriers(req.user) });
}));
deliveryRoutes.post('/payment-requests/:id/delivery', authorize('PATIENT'), validate({ params: idParams, body: deliveryContactSchema }), asyncHandler(withWorkflowLease(async (req, res) => res.status(201).json({ data: await deliveryService.request(Number(req.params.id), req.body, req.user) }))));
// Patient can cancel their own REQUESTED delivery before the pharmacy confirms it
deliveryRoutes.delete('/payment-requests/:id/delivery', authorize('PATIENT'), validate({ params: idParams }), asyncHandler(withWorkflowLease(async (req, res) => {
  await prisma.$transaction(async (tx) => {
    const row = await tx.deliveryRequest.findFirst({
      where: { paymentRequestId: Number(req.params.id), paymentRequest: { patientId: req.user.id } },
      include: { paymentRequest: { select: { revision: true } } },
    });
    // Do not reveal whether another patient's invoice has a delivery request.
    if (!row) throw new AppError(404, 'Delivery request not found.');
    if (row.status !== 'REQUESTED') throw new AppError(409, 'This delivery can no longer be cancelled. Contact the pharmacy for assistance.');
    const changed = await tx.deliveryRequest.updateMany({
      where: { id: row.id, status: 'REQUESTED' },
      data: { status: 'CANCELLED' },
    });
    if (changed.count !== 1) throw new AppError(409, 'Delivery details changed. Refresh and review the latest status.');
    await tx.paymentRequestEvent.create({ data: {
      paymentRequestId: row.paymentRequestId,
      revision: row.paymentRequest.revision,
      actorId: req.user.id,
      kind: 'DELIVERY_CANCELLED_BY_PATIENT',
      details: { previousStatus: row.status },
    } });
  });
  res.json({ message: 'Delivery request cancelled. You can re-request delivery if needed.' });
})));
deliveryRoutes.post('/payment-requests/:id/delivery/reshipment', authorize('PATIENT'), validate({ params: idParams }), asyncHandler(withWorkflowLease(async (req, res) => res.json({ data: await deliveryService.requestReshipment(Number(req.params.id), req.user) }))));
deliveryRoutes.post('/payment-requests/:id/delivery/reshipment/withdraw', authorize('PATIENT'), validate({ params: idParams }), asyncHandler(withWorkflowLease(async (req, res) => res.json({ data: await deliveryService.requestReshipment(Number(req.params.id), req.user, true) }))));
deliveryRoutes.put('/payment-requests/:id/delivery', authorize('ADMIN', 'PHARMACIST'), validate({ params: idParams, body: deliveryActionSchema }), asyncHandler(withWorkflowLease(async (req, res) => res.json({ data: await deliveryService.act(Number(req.params.id), req.body, req.user) }))));
deliveryRoutes.get('/delivery-settings', authorize('ADMIN', 'PHARMACIST', 'CASHIER', 'PATIENT'), asyncHandler(async (_req, res) => {
  const { prisma } = await import('../config/prisma.js');
  const setting = await prisma.systemSetting.findUnique({ where: { key: 'standardDeliveryFee' } });
  res.json({ data: { fee: setting ? Number(setting.value) : null } });
}));
deliveryRoutes.put('/delivery-settings', authorize('ADMIN'), validate({ body: z.object({ fee: z.number().positive().max(1000000).multipleOf(0.01) }) }), asyncHandler(async (req, res) => {
  const { prisma } = await import('../config/prisma.js');
  const { recordAudit } = await import('../services/audit.service.js');
  await prisma.systemSetting.upsert({ where: { key: 'standardDeliveryFee' }, create: { key: 'standardDeliveryFee', value: String(req.body.fee) }, update: { value: String(req.body.fee) } });
  await recordAudit({ userId: req.user.id, action: 'DELIVERY_FEE_UPDATED', entityType: 'SYSTEM_SETTING', details: req.body, ipAddress: req.ip });
  res.json({ data: req.body });
}));
