import { z } from 'zod';
import { localDateKey } from '../utils/localDate.js';
export const calendarDate = z.iso.date();
export const calendarMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).refine(value => calendarDate.safeParse(`${value}-01`).success, 'Choose a valid calendar month.');
export const reportRange = z.object({ from: calendarDate, to: calendarDate }).refine(value => value.from <= value.to, 'Start date must not exceed end date.')
  .refine(value => (Date.parse(value.to) - Date.parse(value.from)) / 86400000 <= 3660, 'Choose at most ten years per report.');

// A day picked in a date box ("2026-11-20"). It is compared with today's date
// in Sri Lanka, not with the current UTC time. Parsing "2026-11-20" as a Date
// gives midnight UTC, which is 05:30 in Colombo, so a date chosen between
// 00:00 and 05:30 used to be rejected as "in the future".
// The output stays a Date at midnight UTC, which Prisma stores as that day.
const dayText = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? value : value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value.trim())) return value.trim().slice(0, 10);
  return typeof value === 'string' ? value.trim() : value;
};
export const notFutureCalendarDate = (message, { earliest, earliestMessage } = {}) => {
  let schema = z.preprocess(dayText, calendarDate).refine((value) => value <= localDateKey(new Date()), message);
  if (earliest) schema = schema.refine((value) => value >= earliest, earliestMessage || message);
  return schema.transform((value) => new Date(`${value}T00:00:00Z`));
};
