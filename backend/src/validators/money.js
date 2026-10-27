import { z } from 'zod';
export const moneySchema = z.coerce.number().finite().min(0).max(9999999999.99).multipleOf(0.01, 'Use at most two decimal places.');
