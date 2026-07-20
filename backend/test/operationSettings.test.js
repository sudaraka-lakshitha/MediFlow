import { describe, expect, it } from "vitest";
import { batchAllocationOrder } from "../src/services/operationSettings.service.js";

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
