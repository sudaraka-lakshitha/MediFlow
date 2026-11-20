// PHARMACY SETTINGS (set by the admin)
// - stock allocation: FIFO (oldest delivery first) or FEFO (soonest expiry first)
// - near-expiry warning days
// - audit trash on/off and how long trash is kept
// - whether a collection PIN is required
// - whether the cashier can hand over medicines at payment
// - how many hours stock is set aside for an unpaid cash order
// - default auto-lock minutes

import { prisma } from "../config/prisma.js";
import { DEFAULT_TRANSACTION_OPTIONS } from "../utils/serializable.js";

const keys = {
  allocationMethod: "stockAllocationMethod",
  nearExpiryDays: "nearExpiryWarningDays",
  auditTrashEnabled: "auditTrashEnabled",
  auditTrashRetentionDays: "auditTrashRetentionDays",
  requirePickupPin: "requirePickupPin",
  cashierCanDispenseAtPayment: "cashierCanDispenseAtPayment",
  cashReservationHours: "cashReservationHours",
  sessionIdleMinutes: "sessionIdleMinutes",
};

// Values used until the admin changes them.
const defaults = {
  allocationMethod: "FIFO",
  nearExpiryDays: 90,
  auditTrashEnabled: true,
  auditTrashRetentionDays: 30,
  requirePickupPin: true,
  cashierCanDispenseAtPayment: false,
  cashReservationHours: 24,
  sessionIdleMinutes: 15,
};

const settingMap = (rows) =>
  Object.fromEntries(rows.map((setting) => [setting.key, setting.value]));

// Which batch to take stock from first: FIFO = the oldest delivery, FEFO = the batch that expires
// soonest.
export const batchAllocationOrder = (method) =>
  method === "FEFO"
    ? [{ expiryDate: "asc" }, { receivedAt: "asc" }, { id: "asc" }]
    : [{ receivedAt: "asc" }, { expiryDate: "asc" }, { id: "asc" }];

export const operationSettingsService = {
  // Read the current settings (missing ones fall back to the defaults).
  async get(client = prisma) {
    const rows = await client.systemSetting.findMany({
      where: { key: { in: Object.values(keys) } },
    });
    const values = settingMap(rows);
    const allocationMethod = ["FIFO", "FEFO"].includes(
      values[keys.allocationMethod],
    )
      ? values[keys.allocationMethod]
      : defaults.allocationMethod;
    const parsedDays = Number(values[keys.nearExpiryDays]);
    const parsedAuditTrashDays = Number(values[keys.auditTrashRetentionDays]);
    const parsedCashReservationHours = Number(values[keys.cashReservationHours]);
    return {
      sessionIdleMinutes: Number.isInteger(Number(values[keys.sessionIdleMinutes])) && Number(values[keys.sessionIdleMinutes]) >= 5 && Number(values[keys.sessionIdleMinutes]) <= 60
        ? Number(values[keys.sessionIdleMinutes]) : defaults.sessionIdleMinutes,
      allocationMethod,
      nearExpiryDays:
        Number.isInteger(parsedDays) && parsedDays >= 7 && parsedDays <= 365
          ? parsedDays
          : defaults.nearExpiryDays,
      auditTrashEnabled:
        values[keys.auditTrashEnabled] === undefined
          ? defaults.auditTrashEnabled
          : values[keys.auditTrashEnabled] === "true",
      auditTrashRetentionDays:
        Number.isInteger(parsedAuditTrashDays) &&
        parsedAuditTrashDays >= 1 &&
        parsedAuditTrashDays <= 365
          ? parsedAuditTrashDays
          : defaults.auditTrashRetentionDays,
      requirePickupPin:
        values[keys.requirePickupPin] === undefined
          ? defaults.requirePickupPin
          : values[keys.requirePickupPin] === "true",
      cashierCanDispenseAtPayment:
        values[keys.cashierCanDispenseAtPayment] === undefined
          ? defaults.cashierCanDispenseAtPayment
          : values[keys.cashierCanDispenseAtPayment] === "true",
      cashReservationHours:
        Number.isInteger(parsedCashReservationHours) && parsedCashReservationHours >= 1 && parsedCashReservationHours <= 168
          ? parsedCashReservationHours
          : defaults.cashReservationHours,
    };
  },

  // Save new settings.
  async update(data) {
    await prisma.$transaction([
      prisma.systemSetting.upsert({
        where: { key: keys.sessionIdleMinutes },
        create: { key: keys.sessionIdleMinutes, value: String(data.sessionIdleMinutes ?? defaults.sessionIdleMinutes) },
        update: { value: String(data.sessionIdleMinutes ?? defaults.sessionIdleMinutes) },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.allocationMethod },
        create: { key: keys.allocationMethod, value: data.allocationMethod },
        update: { value: data.allocationMethod },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.nearExpiryDays },
        create: { key: keys.nearExpiryDays, value: String(data.nearExpiryDays) },
        update: { value: String(data.nearExpiryDays) },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.auditTrashEnabled },
        create: { key: keys.auditTrashEnabled, value: String(data.auditTrashEnabled) },
        update: { value: String(data.auditTrashEnabled) },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.auditTrashRetentionDays },
        create: { key: keys.auditTrashRetentionDays, value: String(data.auditTrashRetentionDays) },
        update: { value: String(data.auditTrashRetentionDays) },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.requirePickupPin },
        create: { key: keys.requirePickupPin, value: String(data.requirePickupPin) },
        update: { value: String(data.requirePickupPin) },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.cashierCanDispenseAtPayment },
        create: { key: keys.cashierCanDispenseAtPayment, value: String(data.cashierCanDispenseAtPayment) },
        update: { value: String(data.cashierCanDispenseAtPayment) },
      }),
      prisma.systemSetting.upsert({
        where: { key: keys.cashReservationHours },
        create: { key: keys.cashReservationHours, value: String(data.cashReservationHours) },
        update: { value: String(data.cashReservationHours) },
      }),
    ], DEFAULT_TRANSACTION_OPTIONS);
    return this.get();
  },
};
