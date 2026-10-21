import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
vi.mock('../src/config/env.js', () => ({ env: { JWT_SECRET: 'test-secret' } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: { user: { findFirst: vi.fn() } } }));
import { prisma } from '../src/config/prisma.js';
import { authenticate } from '../src/middleware/authenticate.js';

describe('authentication failure classification', () => {
  beforeEach(() => vi.clearAllMocks());
  const request = token => ({ headers: { authorization: `Bearer ${token}` }, originalUrl: '/api/navigation/attention' });
  it('rejects forged tokens with 401 without querying the database', async () => {
    const next = vi.fn();
    await authenticate(request(jwt.sign({ sub: '1', exp: 1 }, 'wrong-secret')), {}, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });
  it('preserves database failures instead of claiming the token expired', async () => {
    const failure = new Error('Database unavailable');
    prisma.user.findFirst.mockRejectedValueOnce(failure);
    const next = vi.fn();
    await authenticate(request(jwt.sign({ sub: '1' }, 'test-secret')), {}, next);
    expect(next).toHaveBeenCalledWith(failure);
  });
  it('still rejects revoked sessions', async () => {
    prisma.user.findFirst.mockResolvedValueOnce({ tokenVersion: 2 });
    const next = vi.fn();
    await authenticate(request(jwt.sign({ sub: '1', version: 1 }, 'test-secret')), {}, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});
