import { describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "../src/middleware/rateLimit.js";

describe("authentication rate limiting", () => {
  it("rejects attempts after the configured maximum", () => {
    const limiter = createRateLimiter({
      windowMs: 60_000,
      max: 2,
      message: "Too many attempts.",
    });
    const req = {
      ip: "127.0.0.1",
      body: { email: "staff@example.com" },
    };
    const res = { setHeader: vi.fn() };
    const next = vi.fn();

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(3);
    expect(next.mock.calls[2][0]).toMatchObject({
      statusCode: 429,
      message: "Too many attempts.",
    });
  });
});
