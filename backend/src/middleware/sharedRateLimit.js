// The same kind of limit, but counted in the database, so it still works with several servers or
// after a restart.

import { createHash } from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';

let nextCleanup = 0;
export async function consumeAuthAttempt(id, expiresAt) {
  // An atomic database counter works across application instances and restarts.
  await prisma.$executeRaw`INSERT INTO auth_rate_limits (id, attempts, expires_at)
    VALUES (${id}, 1, ${expiresAt}) ON DUPLICATE KEY UPDATE attempts = attempts + 1`;
  const row = await prisma.authRateLimit.findUnique({ where: { id } });
  const now = Date.now();
  if (now >= nextCleanup) {
    nextCleanup = now + 300_000;
    void prisma.authRateLimit.deleteMany({ where: { expiresAt: { lt: new Date(now - 3600_000) } } })
      .catch(error => logger.warn('Authentication throttle cleanup failed.', { code: error.code }));
  }
  return row.attempts;
}

export const createSharedRateLimiter = ({ namespace, windowMs, max, ipMax, message, consume = consumeAuthAttempt }) => async (req, res, next) => {
  try {
    const now = Date.now(), bucket = Math.floor(now / windowMs), expiresAt = new Date((bucket + 1) * windowMs);
    // Separate IP and account budgets prevent rotating account names on one IP
    // or attacking one account from several IP addresses. Never store raw emails.
    const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 190);
    const budgets = [['ip', req.ip || 'unknown', ipMax], ...(email ? [['account', email, max]] : [])];
    for (const [kind, value, limit] of budgets) {
      const key = createHash('sha256').update(JSON.stringify([namespace, kind, value, bucket])).digest('hex');
      const count = await consume(key, expiresAt);
      if (count > limit) {
        res.setHeader('Retry-After', String(Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000))));
        return next(new AppError(429, message));
      }
    }
    next();
  } catch (error) {
    logger.error('Authentication throttle unavailable.', { code: error.code });
    next(new AppError(503, 'Sign-in security is temporarily unavailable. Please try again shortly.'));
  }
};
