import { prisma } from "../config/prisma.js";

const keys = {
  allocationMethod: "stockAllocationMethod",
  nearExpiryDays: "nearExpiryWarningDays",
};

const defaults = {
  allocationMethod: "FIFO",
  nearExpiryDays: 90,
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
    return {
      allocationMethod,
      nearExpiryDays:
        Number.isInteger(parsedDays) && parsedDays >= 7 && parsedDays <= 365
          ? parsedDays
          : defaults.nearExpiryDays,
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
    ]);
    return this.get();
  },
};
