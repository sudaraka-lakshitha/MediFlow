import { describe, expect, it } from "vitest";
import {
  reviewUploadSchema,
  uploadEstimateQuoteSchema,
} from "../src/validators/prescriptionUpload.validator.js";

describe("uploaded prescription estimate validation", () => {
  it("accepts medicine quantities, tax, coupon, and bottle fees", () => {
    const result = uploadEstimateQuoteSchema.parse({
      items: [{ productId: 10, quantity: 100 }],
      couponCode: "SAVE10",
      containerFee: 40,
      tax: 5,
    });
    expect(result.containerFee).toBe(40);
    expect(result.items[0]).toEqual({ productId: 10, quantity: 100 });
    expect(result.retailItems).toEqual([]);
  });

  it("accepts optional retail items in the same expected invoice", () => {
    const result = uploadEstimateQuoteSchema.parse({
      items: [{ productId: 10, quantity: 12 }],
      retailItems: [{ productId: 80, quantity: 2 }],
    });
    expect(result.retailItems).toEqual([{ productId: 80, quantity: 2 }]);
  });

  it("rejects duplicate medicine lines", () => {
    const result = uploadEstimateQuoteSchema.safeParse({
      items: [
        { productId: 10, quantity: 50 },
        { productId: 10, quantity: 25 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate retail lines", () => {
    const result = uploadEstimateQuoteSchema.safeParse({
      items: [{ productId: 10, quantity: 12 }],
      retailItems: [
        { productId: 80, quantity: 1 },
        { productId: 80, quantity: 2 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("allows a fully available review without a mandatory note", () => {
    const result = reviewUploadSchema.parse({
      status: "AVAILABLE",
      availabilityNotes: "",
    });
    expect(result.status).toBe("AVAILABLE");
    expect(result.estimatedTotal).toBeUndefined();
  });

  it("requires a note for partial availability", () => {
    const result = reviewUploadSchema.safeParse({
      status: "PARTIALLY_AVAILABLE",
      availabilityNotes: "",
      estimatedTotal: 100,
    });
    expect(result.success).toBe(false);
  });
});
