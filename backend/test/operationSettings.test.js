import { describe, expect, it } from "vitest";
import { batchAllocationOrder } from "../src/services/operationSettings.service.js";
import { operationSettingsSchema } from "../src/validators/operationSettings.validator.js";

describe("batch allocation policy", () => {
  it("keeps FIFO as the default academic requirement", () => {
    expect(batchAllocationOrder("FIFO")).toEqual([
      { receivedAt: "asc" },
      { expiryDate: "asc" },
      { id: "asc" },
    ]);
  });

  it("supports FEFO for earliest-expiry pharmacy operations", () => {
    expect(batchAllocationOrder("FEFO")).toEqual([
      { expiryDate: "asc" },
      { receivedAt: "asc" },
      { id: "asc" },
    ]);
  });
});

describe("audit trash policy validation", () => {
  it("accepts an enabled configurable retention period", () => {
    expect(operationSettingsSchema.parse({
      allocationMethod: "FEFO",
      nearExpiryDays: 90,
      auditTrashEnabled: true,
      auditTrashRetentionDays: 45,
    })).toMatchObject({ auditTrashEnabled: true, auditTrashRetentionDays: 45 });
  });

  it("rejects retention outside the supported 1–365 day range", () => {
    expect(() => operationSettingsSchema.parse({
      allocationMethod: "FIFO",
      nearExpiryDays: 90,
      auditTrashEnabled: false,
      auditTrashRetentionDays: 0,
    })).toThrow();
  });
});
