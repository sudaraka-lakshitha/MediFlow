import { prisma } from "../config/prisma.js";

const keys = {
  allocationMethod: "stockAllocationMethod",
  nearExpiryDays: "nearExpiryWarningDays",
  auditTrashEnabled: "auditTrashEnabled",
  auditTrashRetentionDays: "auditTrashRetentionDays",
};

const defaults = {
  allocationMethod: "FIFO",
  nearExpiryDays: 90,
  auditTrashEnabled: true,
  auditTrashRetentionDays: 30,
};

const settingMap = (rows) =>
  Object.fromEntries(rows.map((setting) => [setting.key, setting.value]));

export const batchAllocationOrder = (method) =>
  method === "FEFO"
    ? [{ expiryDate: "asc" }, { receivedAt: "asc" }, { id: "asc" }]
    : [{ receivedAt: "asc" }, { expiryDate: "asc" }, { id: "asc" }];

export const operationSettingsService = {
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
    return {
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
    };
  },

  async update(data) {
    await prisma.$transaction([
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
    ]);
    return this.get();
  },
};
