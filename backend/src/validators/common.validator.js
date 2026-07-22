import { z } from 'zod';

export const idParams = z.object({ id: z.coerce.number().int().positive() });
export const activeSchema = z.object({ active: z.boolean() });
export const searchQuery = z.object({ search: z.string().trim().max(120).optional(), limit: z.coerce.number().int().positive().max(200).optional() });
