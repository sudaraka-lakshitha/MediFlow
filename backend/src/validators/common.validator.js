// Input rules for shared things such as record numbers in addresses and search boxes. Wrong or
// missing input is stopped here with a clear message, before it reaches the services.

import { z } from 'zod';

export const idParams = z.object({ id: z.coerce.number().int().positive() });
export const slipParams = z.object({ id: z.coerce.number().int().positive(), slipId: z.coerce.number().int().positive() });
export const activeSchema = z.object({ active: z.boolean() });
export const searchQuery = z.object({
  search: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
});
export const patientListQuery = searchQuery.extend({ userId: z.coerce.number().int().positive().optional() });
