import { describe, expect, it } from "vitest";
import { staffSchema } from "../src/validators/auth.validator.js";
import { auditQuerySchema, myActivityQuerySchema } from "../src/validators/audit.validator.js";
import { buildAuditWhere } from "../src/services/audit.service.js";

describe("staff administration validation", () => {
  it("creates staff without patient-only date-of-birth data", () => {
    const result = staffSchema.safeParse({
      fullName: "Test Pharmacist",
      email: "pharmacist@example.com",
      phone: "0712345678",
      password: "Secure123!",
      role: "PHARMACIST",
      cashierAccess: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects malformed Sri Lankan mobile numbers", () => {
    const result = staffSchema.safeParse({
      fullName: "Test Cashier",
      email: "cashier@example.com",
      phone: "712345678",
      password: "Secure123!",
      role: "CASHIER",
      cashierAccess: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("staff audit filters", () => {
  it("coerces pagination and failed-only filters", () => {
    const query = auditQuerySchema.parse({
      userId: "4",
      success: "false",
      page: "2",
      pageSize: "25",
    });
    expect(query).toMatchObject({
      userId: 4,
      success: false,
      page: 2,
      pageSize: 25,
    });
    expect(buildAuditWhere(query)).toMatchObject({ userId: 4, success: false });
  });

  it("separates active audit records from recoverable trash", () => {
    const active = auditQuerySchema.parse({});
    const trash = auditQuerySchema.parse({ view: "trash" });
    expect(buildAuditWhere(active).deletedAt).toBeNull();
    expect(buildAuditWhere(trash).deletedAt).toEqual({ not: null });
  });

  it("allows a staff member to review no more than 31 inclusive days", () => {
    expect(myActivityQuerySchema.safeParse({ from: "2026-06-17", to: "2026-07-17" }).success).toBe(true);
    const tooLong = myActivityQuerySchema.safeParse({ from: "2026-06-16", to: "2026-07-17" });
    expect(tooLong.success).toBe(false);
    expect(tooLong.error?.issues[0]?.message).toContain("maximum of 31 days");
  });
});
