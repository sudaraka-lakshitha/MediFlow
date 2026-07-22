import { env } from '../config/env.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;

export const localDateKey = (date) => new Date(date.getTime() + offsetMs).toISOString().slice(0, 10);
export const isSameLocalDay = (a, b) => localDateKey(new Date(a)) === localDateKey(new Date(b));
