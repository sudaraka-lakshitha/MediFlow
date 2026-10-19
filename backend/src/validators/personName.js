import { z } from 'zod';

export const personNamePattern = /^[A-Za-z]+(?:(?: +|[.'’\-] *)[A-Za-z]+)*\.?$/;
export const normalizePersonName = (value) => value.trim().replace(/ +/g, ' ')
  .replace(/(^|[ .'’\-])([a-z])/g, (_, separator, letter) => separator + letter.toUpperCase());

export const personNameSchema = z.string().trim().min(2, 'Enter a name of at least two characters.')
  .max(150, 'Names cannot exceed 150 characters.')
  .regex(personNamePattern, 'Use English letters, spaces, apostrophes, hyphens, or periods only. Names must contain letters.')
  .transform(normalizePersonName);

export const optionalPersonNameSchema = personNameSchema.or(z.string().trim().length(0)).nullable().optional();
