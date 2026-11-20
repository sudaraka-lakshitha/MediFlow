// Input rules for stock batches: receiving, correcting, restricting and disposing of stock. Wrong
// or missing input is stopped here with a clear message, before it reaches the services.

import { z } from 'zod';
import { moneySchema } from './money.js';
import { base64WorkbookLimit } from '../utils/workbookLimits.js';

export const batchRestrictionSchema = z.object({
  restricted: z.boolean(),
  reason: z.string().trim().max(500).optional().nullable(),
}).superRefine((data, context) => {
  if (data.restricted && !data.reason) context.addIssue({ code: 'custom', path: ['reason'], message: 'A reason is required when restricting a batch.' });
});

export const receiveStockSchema = z.object({
  productId: z.coerce.number().int().positive(), supplierId: z.coerce.number().int().positive().optional().nullable(),
  batchNumber: z.string().trim().min(1).max(80), quantity: z.coerce.number().positive(),
  purchasePrice: moneySchema, expiryDate: z.coerce.date(), note: z.string().trim().max(300).optional().nullable(),
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
  purchasePrice:moneySchema, expiryDate:z.coerce.date(),
});

export const bulkStockExcelSchema = z.object({
  fileBase64: z.string().min(8).max(base64WorkbookLimit('stock')).regex(/^[A-Za-z0-9+/]+={0,2}$/),
});

export const bulkStockRowsSchema = z.object({
  rows: z.array(z.record(z.string(), z.any())).min(1).max(500),
  previewToken: z.string().max(2000).optional(),
});
