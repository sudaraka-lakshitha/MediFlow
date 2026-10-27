import { z } from 'zod';
export const phoneSchema = z.string().trim().regex(/^(?:0\d{9}|\+94\d{9})$/, 'Use 0701234567 or +94701234567 (no spaces or hyphens).')
  .transform(value => value.startsWith('+94') ? `0${value.slice(3)}` : value);
