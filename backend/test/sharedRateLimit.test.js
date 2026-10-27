import { expect, it, vi } from 'vitest';
vi.mock('../src/config/logger.js', () => ({ logger: { error: vi.fn(), warn: vi.fn() } }));
import { createSharedRateLimiter } from '../src/middleware/sharedRateLimit.js';
it('shares account budgets between instances and IPs and IP budgets between accounts', async () => {
  const counts = new Map();
  const consume = vi.fn(async key => { const count = (counts.get(key) || 0) + 1; counts.set(key, count); return count; });
  const options = { namespace: 'login', windowMs: 60000, max: 2, ipMax: 3, message: 'Wait', consume };
  const one = createSharedRateLimiter(options), two = createSharedRateLimiter(options);
  const next = vi.fn(), res = { setHeader: vi.fn() };
  await one({ ip: 'a', body: { email: 'Patient@example.test' } }, res, next);
  await two({ ip: 'b', body: { email: 'patient@example.test' } }, res, next);
  await one({ ip: 'c', body: { email: 'patient@example.test' } }, res, next);
  expect(next.mock.calls[2][0]).toMatchObject({ statusCode: 429 });
  for (const email of ['other1', 'other2', 'other3']) await two({ ip: 'a', body: { email } }, res, next);
  expect(next.mock.lastCall[0]).toMatchObject({ statusCode: 429 });
  expect([...counts.keys()].every(key => /^[a-f0-9]{64}$/.test(key))).toBe(true);
});
it('fails closed when the shared store is unavailable', async () => {
  const limiter = createSharedRateLimiter({ namespace: 'login', windowMs: 1000, max: 1, ipMax: 2, consume: async () => { throw new Error('db unavailable'); } });
  const next = vi.fn(); await limiter({ ip: 'a' }, {}, next);
  expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
});
