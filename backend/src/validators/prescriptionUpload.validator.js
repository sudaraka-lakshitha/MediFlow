import { z } from 'zod';

export const uploadPrescriptionSchema = z.object({
  originalName: z.string().trim().min(1).max(180),
  mimeType: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain']),
  fileBase64: z.string().min(8).max(3_600_000).regex(/^[A-Za-z0-9+/]+={0,2}$/, 'The uploaded file is not valid base64 data.'),
  patientNote: z.string().trim().max(500).optional().nullable(),
  prepareRequested: z.boolean(),
  orderedForSelf: z.boolean().default(true),
  recipientName: z.string().trim().max(150).optional().nullable(),
  recipientRelationship: z.string().trim().max(100).optional().nullable(),
}).superRefine((data, context) => {
  if (!data.orderedForSelf && !data.recipientName) context.addIssue({ code: 'custom', path: ['recipientName'], message: 'Recipient name is required.' });
  if (!data.orderedForSelf && !data.recipientRelationship) context.addIssue({ code: 'custom', path: ['recipientRelationship'], message: 'Relationship is required.' });
});

export const reviewUploadSchema = z.object({
  status: z.enum(['AVAILABLE', 'PARTIALLY_AVAILABLE', 'UNAVAILABLE', 'REJECTED']),
  availabilityNotes: z.string().trim().max(1000).optional().nullable(),
  estimatedTotal: z.coerce.number().nonnegative().max(100_000_000).optional().nullable(),
}).superRefine((data, context) => {
  if (['AVAILABLE', 'PARTIALLY_AVAILABLE'].includes(data.status) && data.estimatedTotal == null) {
    context.addIssue({ code: 'custom', path: ['estimatedTotal'], message: 'An estimated invoice total is required when medicines are available.' });
  }
  if (data.status !== 'AVAILABLE' && (!data.availabilityNotes || data.availabilityNotes.length < 3)) {
    context.addIssue({ code: 'custom', path: ['availabilityNotes'], message: 'Add a short note explaining partial or unavailable medicines.' });
  }
});

const estimateItem = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().positive().max(1_000_000),
});

export const uploadEstimateQuoteSchema = z.object({
  couponCode: z.string().trim().max(40).optional().nullable(),
  containerFee: z.coerce.number().nonnegative().max(100_000_000).default(0),
  bottleCount: z.coerce.number().int().positive().max(1000).default(1),
  bottleFeePerBottle: z.coerce.number().nonnegative().max(100_000_000).default(0),
  tax: z.coerce.number().nonnegative().max(100_000_000).default(0),
  items: z.array(estimateItem).min(1).max(50),
  retailItems: z.array(estimateItem).max(50).default([]),
})
  .refine(
    (data) => new Set(data.items.map((item) => item.productId)).size === data.items.length,
    { path: ['items'], message: 'Each medicine can appear only once in an estimate.' },
  )
  .refine(
    (data) => new Set(data.retailItems.map((item) => item.productId)).size === data.retailItems.length,
    { path: ['retailItems'], message: 'Each retail item can appear only once in an estimate.' },
  );
