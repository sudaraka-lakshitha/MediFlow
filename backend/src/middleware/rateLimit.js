// Limits how many times someone can try an action (like signing in) in a short time, to stop
// password guessing. This version counts in memory.

import { AppError } from "../utils/AppError.js";

export const createRateLimiter = ({
  windowMs,
  max,
  message,
  key = (req) =>
    `${req.ip}:${String(req.body?.email || "").trim().toLowerCase()}`,
}) => {
  const attempts = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [entryKey, entry] of attempts) {
      if (entry.resetAt <= now) attempts.delete(entryKey);
    }
  }, windowMs);
  cleanup.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const entryKey = key(req);
    const current = attempts.get(entryKey);
    const entry =
      !current || current.resetAt <= now
        ? { count: 0, resetAt: now + windowMs }
        : current;
    entry.count += 1;
    attempts.set(entryKey, entry);

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader(
      "X-RateLimit-Remaining",
      String(Math.max(0, max - entry.count)),
    );
    if (entry.count > max) {
      res.setHeader(
        "Retry-After",
        String(Math.max(1, Math.ceil((entry.resetAt - now) / 1000))),
      );
      return next(new AppError(429, message));
    }
    next();
  };
};
