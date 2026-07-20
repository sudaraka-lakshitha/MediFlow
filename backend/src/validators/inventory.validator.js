import { z } from 'zod';

export const batchRestrictionSchema = z.object({
  restricted: z.boolean(),
  reason: z.string().trim().max(500).optional().nullable(),
}).superRefine((data, context) => {
  if (data.restricted && !data.reason) context.addIssue({ code: 'custom', path: ['reason'], message: 'A reason is required when restricting a batch.' });
});

export const receiveStockSchema = z.object({
  productId: z.coerce.number().int().positive(), supplierId: z.coerce.number().int().positive().optional().nullable(),
  batchNumber: z.string().trim().min(1).max(80), quantity: z.coerce.number().positive(),
  purchasePrice: z.coerce.number().nonnegative(), expiryDate: z.coerce.date(), note: z.string().trim().max(300).optional().nullable(),
}).refine((data) => data.expiryDate > new Date(), { path: ['expiryDate'], message: 'Expiry date must be in the future.' });

export const adjustmentSchema = z.object({
  quantityChange: z.coerce.number().refine((value) => value !== 0, 'Quantity change cannot be zero.'),
  reason: z.string().trim().min(3).max(300),
});
export const expiredStockDispositionSchema = z.object({
  action: z.enum(['DISCARDED', 'DESTROYED', 'RETURNED_TO_SUPPLIER', 'RETURNED_TO_MANUFACTURER']),
  quantity: z.coerce.number().positive().max(1_000_000),
  reason: z.string().trim().min(3).max(220),
  destinationName: z.string().trim().max(120).optional().nullable(),
}).superRefine((data, context) => {
  if (data.action.startsWith('RETURNED_') && !data.destinationName) {
    context.addIssue({
      code: 'custom',
      path: ['destinationName'],
      message: 'Enter the supplier or manufacturer receiving the returned stock.',
    });
  }
});
export const updateBatchSchema = z.object({
  supplierId:z.coerce.number().int().positive().optional().nullable(), batchNumber:z.string().trim().min(1).max(80),
  purchasePrice:z.coerce.number().nonnegative(), expiryDate:z.coerce.date(),
});
