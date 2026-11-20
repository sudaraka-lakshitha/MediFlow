// Input rules for home deliveries. Wrong or missing input is stopped here with a clear message,
// before it reaches the services.

import { z } from 'zod';
import { personNameSchema } from './personName.js';

export const deliveryFilterSchema = z.object({
  search: z.string().trim().max(190).optional(),
  queue: z.enum(['ALL', 'ATTENTION', 'AWAITING_PAYMENT', 'READY', 'REQUESTED', 'AWAITING_FEE', 'DISPATCHED', 'DELIVERY_FAILED', 'RETURNING', 'DELIVERED', 'RETURNED', 'RESHIP_REQUESTED', 'RESHIP_READY', 'CANCELLED']).default('ALL'),
  courier: z.string().trim().max(120).optional(),
  dateField: z.enum(['createdAt', 'dispatchedAt', 'deliveredAt']).default('createdAt'),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
}).refine(value => !value.from || !value.to || value.from < value.to, { message: 'The end date must follow the start date.' });

export const deliveryContactSchema = z.object({
  recipientName: personNameSchema,
  address: z.string().trim().min(10).max(500),
  phone: z.string().trim().regex(/^(?:0|\+94)\d{9}$/, 'Use 0701234567 or +94701234567.'),
});
export const deliveryActionSchema = z.object({
  action: z.enum(['CONFIRM', 'DISPATCH', 'DELIVERED', 'CANCEL', 'UPDATE_TRACKING', 'UPDATE_DETAILS', 'RETURNED', 'APPROVE_RESHIPMENT', 'RESHIP', 'REQUEST_FEE_CANCELLATION', 'DELIVERY_FAILED', 'RETURNING', 'RETRY_DELIVERY', 'CORRECT_DELIVERED']),
  reason: z.string().trim().min(3).max(500).optional(),
  inspectionConfirmed: z.literal(true).optional(),
  trackingReference: z.string().trim().min(3).max(160).optional(),
  courierService: z.string().trim().min(2).max(120).optional(),
  recipientName: personNameSchema.optional(),
  address: deliveryContactSchema.shape.address.optional(),
  phone: deliveryContactSchema.shape.phone.optional(),
  expectedUpdatedAt: z.iso.datetime(),
}).superRefine((data, ctx) => {
  if (['DISPATCH', 'UPDATE_TRACKING', 'RESHIP'].includes(data.action) && (!data.trackingReference || !data.courierService)) ctx.addIssue({ code: 'custom', message: 'Courier service and tracking number are required.' });
  if (['RETURNED', 'APPROVE_RESHIPMENT', 'REQUEST_FEE_CANCELLATION', 'DELIVERY_FAILED', 'RETURNING', 'RETRY_DELIVERY', 'CORRECT_DELIVERED'].includes(data.action) && !data.reason) ctx.addIssue({ code: 'custom', message: 'Record the return or inspection reason.' });
  if (data.action === 'APPROVE_RESHIPMENT' && !data.inspectionConfirmed) ctx.addIssue({ code: 'custom', message: 'Confirm pharmacist inspection before approving reshipment.' });
  if (data.action === 'UPDATE_DETAILS' && !data.recipientName && !data.address && !data.phone) ctx.addIssue({ code: 'custom', message: 'Provide at least one recipient detail to update.' });
});
