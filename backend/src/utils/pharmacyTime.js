// SRI LANKA TIME FOR PRINTED DOCUMENTS
// The database stores every time in UTC (world time). These helpers turn a stored time into
// Sri Lanka time (UTC + 5 hours 30 minutes) for PDFs, receipts and file exports.

export const PHARMACY_TIME_ZONE = 'Asia/Colombo';

// Example: 2026-11-20 02:03 UTC becomes "20/11/2026, 07:33:00".
export const formatPharmacyTimestamp = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: PHARMACY_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
};

// Example: "2026-11-20T07:33:00+05:30". Used in CSV and Excel exports so the time zone is part of
// the value.
export const formatPharmacyIsoTimestamp = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PHARMACY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}+05:30`;
};

// Today's date in Sri Lanka as YYYY-MM-DD.
export const pharmacyDateKey = (value = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PHARMACY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value instanceof Date ? value : new Date(value));
  const part = (type) => parts.find((entry) => entry.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};
