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
export const deliveryRoutes = Router();
// Authenticate only matching delivery routes; leave login and registration public.
deliveryRoutes.use(['/deliveries', '/delivery-settings', '/payment-requests/:id/delivery'], authenticate);
deliveryRoutes.get('/deliveries', authorize('PATIENT', 'ADMIN', 'PHARMACIST', 'CASHIER'), asyncHandler(async (req, res) => {
  const pagination = listPagination(req.query); const data = await deliveryService.list(req.user, pagination);
  res.json({ data, pagination: { ...pagination, hasMore: data.length === pagination.pageSize } });
}));
deliveryRoutes.post('/payment-requests/:id/delivery', authorize('PATIENT'), validate({ params: idParams, body: z.object({ address: z.string().trim().min(10).max(500), phone: z.string().regex(/^(?:0|\+94)\d{9}$/) }) }), asyncHandler(withWorkflowLease(async (req, res) => res.status(201).json({ data: await deliveryService.request(Number(req.params.id), req.body, req.user) }))));
deliveryRoutes.put('/payment-requests/:id/delivery', authorize('ADMIN', 'PHARMACIST'), validate({ params: idParams, body: z.object({ action: z.enum(['CONFIRM', 'DISPATCH', 'DELIVERED', 'CANCEL', 'UPDATE_TRACKING']), trackingReference: z.string().trim().min(3).max(160).optional(), courierService: z.string().trim().min(2).max(120).optional() }).refine(data => !['DISPATCH', 'UPDATE_TRACKING'].includes(data.action) || (!!data.trackingReference && !!data.courierService), 'Courier service and tracking number are required.') }), asyncHandler(withWorkflowLease(async (req, res) => res.json({ data: await deliveryService.act(Number(req.params.id), req.body, req.user) }))));
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
