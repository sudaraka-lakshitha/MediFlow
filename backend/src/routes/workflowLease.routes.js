import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { workflowLeaseService } from '../services/workflowLease.service.js';
export const workflowLeaseRoutes = Router();
workflowLeaseRoutes.use(authenticate);
const params = z.object({ kind: z.enum(['upload', 'prescription', 'payment', 'sale']), id: z.coerce.number().int().positive() });
workflowLeaseRoutes.post('/:kind/:id', validate({ params, body: z.object({ token: z.string().uuid().optional() }) }), asyncHandler(async (req, res) => {
  const resource = await workflowLeaseService.resource(req.params.kind, req.params.id, req.user);
  const data = await workflowLeaseService.acquire(resource, workflowLeaseService.owner(req), req.body.token);
  res.json({ data });
}));
workflowLeaseRoutes.delete('/:kind/:id', validate({ params, body: z.object({ token: z.string().uuid() }) }), asyncHandler(async (req, res) => {
  const resource = await workflowLeaseService.resource(req.params.kind, req.params.id, req.user);
  await workflowLeaseService.release(resource, workflowLeaseService.owner(req), req.body.token);
  res.json({ message: 'Editing lock released.' });
}));
