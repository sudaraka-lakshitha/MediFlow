import { z } from 'zod';
export const calendarDate = z.iso.date();
export const calendarMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).refine(value => calendarDate.safeParse(`${value}-01`).success, 'Choose a valid calendar month.');
export const reportRange = z.object({ from: calendarDate, to: calendarDate }).refine(value => value.from <= value.to, 'Start date must not exceed end date.')
  .refine(value => (Date.parse(value.to) - Date.parse(value.from)) / 86400000 <= 3660, 'Choose at most ten years per report.');
