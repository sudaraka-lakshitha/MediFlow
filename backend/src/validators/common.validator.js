import { z } from 'zod';

export const idParams = z.object({ id: z.coerce.number().int().positive() });
export const activeSchema = z.object({ active: z.boolean() });
