// Input rules for discount rules and coupon codes. Wrong or missing input is stopped here with a
// clear message, before it reaches the services.

import { z } from 'zod';

export const discountRuleSchema = z.object({
  name: z.string().trim().min(2).max(150), code: z.string().trim().max(40).optional().nullable().or(z.literal('')),
  description: z.string().trim().max(400).optional().nullable(), type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.coerce.number().positive(), scope: z.enum(['ORDER', 'CATEGORY', 'PRODUCT']).default('ORDER'),
  productId: z.coerce.number().int().positive().optional().nullable(), categoryId: z.coerce.number().int().positive().optional().nullable(),
  minimumSubtotal: z.coerce.number().nonnegative().default(0), minimumQuantity: z.coerce.number().nonnegative().default(0),
  maximumDiscount: z.coerce.number().positive().optional().nullable(), automatic: z.boolean().default(true), combinable: z.boolean().default(false),
  priority: z.coerce.number().int().min(-1000).max(1000).default(0), startsAt: z.coerce.date().optional().nullable(), endsAt: z.coerce.date().optional().nullable(),
  active: z.boolean().default(true),
}).superRefine((data, context) => {
  if (data.type === 'PERCENTAGE' && data.value > 100) context.addIssue({ code: 'custom', path: ['value'], message: 'Percentage discounts cannot exceed 100%.' });
  if (data.scope === 'PRODUCT' && !data.productId) context.addIssue({ code: 'custom', path: ['productId'], message: 'Select a product for a product discount.' });
  if (data.scope === 'CATEGORY' && !data.categoryId) context.addIssue({ code: 'custom', path: ['categoryId'], message: 'Select a category for a category discount.' });
  if (data.startsAt && data.endsAt && data.startsAt >= data.endsAt) context.addIssue({ code: 'custom', path: ['endsAt'], message: 'End time must be after the start time.' });
  if (!data.automatic && !data.code) context.addIssue({ code: 'custom', path: ['code'], message: 'A coupon code is required when the rule is not automatic.' });
});
