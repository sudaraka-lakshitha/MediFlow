// SRI LANKA DAYS FOR REPORTS
// Reports and "today" counts need to know when a Sri Lanka day starts and ends. These helpers add
// the
// time difference (5 hours 30 minutes by default) to a UTC time to find the local date.

import { env } from '../config/env.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;

// The Sri Lanka date (YYYY-MM-DD) for a stored UTC time. Example: 19 Nov 19:00 UTC is 20 Nov in Sri
// Lanka.
export const localDateKey = (date) => new Date(date.getTime() + offsetMs).toISOString().slice(0, 10);
// True when two times fall on the same Sri Lanka day.
export const isSameLocalDay = (a, b) => localDateKey(new Date(a)) === localDateKey(new Date(b));

// The moment the current Sri Lanka month started.
export const localMonthStart = (date = new Date()) => {
  const local = new Date(date.getTime() + offsetMs);
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1) - offsetMs);
};
