export const PHARMACY_TIME_ZONE = "Asia/Colombo";

type DateValue = string | number | Date | null | undefined;

const asValidDate = (value: DateValue): Date | null => {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatPharmacyDateTime = (value: DateValue): string => {
  const date = asValidDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PHARMACY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
};

export const formatPharmacyDate = (
  value: DateValue,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  const date = asValidDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PHARMACY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(date);
};

export const formatPharmacyTime = (value: DateValue): string => {
  const date = asValidDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PHARMACY_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
};

export const formatPharmacyDateTimeInput = (value: DateValue = new Date()): string => {
  const date = asValidDate(value);
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PHARMACY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
};

export const pharmacyDateTimeInputToISOString = (value: string): string => {
  if (!value) return "";
  // Colombo does not observe daylight saving time: its offset is UTC+05:30.
  const localDateTime = value.length === 16 ? `${value}:00` : value;
  const date = new Date(`${localDateTime}+05:30`);
  if (Number.isNaN(date.getTime())) throw new Error("Enter a valid Sri Lanka date and time.");
  return date.toISOString();
};

export const pharmacyTodayDateInput = (): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PHARMACY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};
