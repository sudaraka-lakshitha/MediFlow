import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const auditQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  action: z.string().trim().max(80).optional(),
  entityType: z.string().trim().max(80).optional(),
  success: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  from: date.optional(),
  to: date.optional(),
  q: z.string().trim().max(100).optional(),
  view: z.enum(['active', 'trash']).default('active'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(200).default(50),
}).refine((data) => !data.from || !data.to || data.from <= data.to, {
  path: ['to'],
  message: 'End date must be on or after the start date.',
});

export const staffAuditSummaryQuerySchema = z.object({
  from: date.optional(),
  to: date.optional(),
}).refine((data) => !data.from || !data.to || data.from <= data.to, {
  path: ['to'],
  message: 'End date must be on or after the start date.',
});

const daysBetween = (from, to) => (
  Date.parse(`${to}T00:00:00.000Z`) - Date.parse(`${from}T00:00:00.000Z`)
) / (24 * 60 * 60 * 1000);

export const myActivityQuerySchema = z.object({
  from: date,
  to: date,
}).refine((data) => data.from <= data.to, {
  path: ['to'],
  message: 'End date must be on or after the start date.',
}).refine((data) => daysBetween(data.from, data.to) <= 30, {
  path: ['to'],
  message: 'My Activity can show a maximum of 31 days at a time.',
});
