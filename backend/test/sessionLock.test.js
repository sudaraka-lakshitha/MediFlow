import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
vi.mock('../src/config/env.js', () => ({ env: { JWT_SECRET: 'test-secret', JWT_EXPIRES_IN: '12h' } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: {
  authSession: { create: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn() },
  user: { findUnique: vi.fn(), findFirst: vi.fn() },
} }));
vi.mock('../src/services/operationSettings.service.js', () => ({ operationSettingsService: { get: vi.fn(async () => ({ sessionIdleMinutes: 15 })) } }));
vi.mock('bcrypt', () => ({ default: { compare: vi.fn() } }));
import bcrypt from 'bcrypt';
import { prisma } from '../src/config/prisma.js';
import { sessionService, sessionView } from '../src/services/session.service.js';
import { authenticate, authenticateSessionControl } from '../src/middleware/authenticate.js';
const user = { id: 1, tokenVersion: 0, active: true, passwordHash: 'hash' };
const row = () => ({ id: 'test-session', userId: 1, generation: 0, lastActiveAt: new Date(), expiresAt: new Date(Date.now() + 8 * 3600000), lockedAt: null, revokedAt: null, unlockAttempts: 0, retryAfter: null });
const payload = { sub: '1', sid: 'test-session', generation: 0, version: 0 };
beforeEach(() => {
  vi.clearAllMocks();
  prisma.authSession.updateMany.mockResolvedValue({ count: 1 });
  prisma.authSession.findUnique.mockResolvedValue(row());
  prisma.user.findUnique.mockResolvedValue(user);
  prisma.user.findFirst.mockResolvedValue(user);
  bcrypt.compare.mockResolvedValue(true);
});
describe('server-enforced session lock', () => {
  it('warns after 15 minutes, locks after the additional minute', () => {
    const session = { ...row(), lastActiveAt: new Date(0), expiresAt: new Date(8 * 3600000) };
    expect(sessionView(session, 15, 15 * 60000)).toMatchObject({ warningAt: 900000, lockAt: 960000, locked: false });
    expect(sessionView(session, 15, 960000).locked).toBe(true);
  });
  it('caps the absolute session at eight hours', async () => {
    const start = Date.now();
    const token = await sessionService.issue(user);
    const data = prisma.authSession.create.mock.calls[0][0].data;
    expect(data.expiresAt.getTime()).toBeLessThanOrEqual(Date.now() + 8 * 3600000);
    expect(data.expiresAt.getTime()).toBeGreaterThanOrEqual(start + 8 * 3600000);
    expect(jwt.verify(token, 'test-secret').sid).toBe(data.id);
  });
  it('does not refresh activity during inspection/background polling', async () => {
    await sessionService.inspect(payload);
    expect(prisma.authSession.updateMany.mock.calls[0][0].data).not.toHaveProperty('lastActiveAt');
  });
  it('cannot revive an expired or locked session through activity', async () => {
    prisma.authSession.updateMany.mockResolvedValue({ count: 0 });
    await expect(sessionService.activity(row())).rejects.toMatchObject({ statusCode: 423 });
    expect(prisma.authSession.updateMany.mock.calls[0][0].where).toMatchObject({ lockedAt: null, revokedAt: null });
  });
  it('rejects old sessions without a tracked ID or generation', async () => {
    await expect(sessionService.inspect({ sub: '1' })).rejects.toMatchObject({ statusCode: 401 });
  });
  it('rejects another user or a revoked session', async () => {
    prisma.authSession.findUnique.mockResolvedValue({ ...row(), userId: 2 });
    await expect(sessionService.inspect(payload)).rejects.toMatchObject({ statusCode: 401 });
    prisma.authSession.findUnique.mockResolvedValue({ ...row(), revokedAt: new Date() });
    await expect(sessionService.inspect(payload)).rejects.toMatchObject({ statusCode: 401 });
  });
  it('blocks protected requests but allows the unlock control route', async () => {
    prisma.authSession.findUnique.mockResolvedValue({ ...row(), lockedAt: new Date() });
    const req = { headers: { authorization: `Bearer ${jwt.sign(payload, 'test-secret')}` }, originalUrl: '/api/sales' };
    const next = vi.fn(); await authenticate(req, {}, next);
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 423 });
    next.mockClear(); await authenticateSessionControl(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });
  it('requires the same account password and rotates the session generation', async () => {
    const result = await sessionService.unlock(row(), 'password', user);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(jwt.verify(result.token, 'test-secret').generation).toBe(1);
    expect(prisma.authSession.updateMany.mock.calls[1][0].data).toMatchObject({ lockedAt: null, generation: 1 });
  });
  it('does not unlock on incorrect password and throttles five failures', async () => {
    bcrypt.compare.mockResolvedValue(false);
    await expect(sessionService.unlock({ ...row(), unlockAttempts: 4 }, 'wrong', user)).rejects.toMatchObject({ statusCode: 400 });
    const update = prisma.authSession.updateMany.mock.calls[1][0];
    expect(update.data.unlockAttempts).toBe(5);
    expect(update.data.retryAfter.getTime()).toBeGreaterThan(Date.now() + 14 * 60000);
    expect(update.data).not.toHaveProperty('lockedAt');
  });
  it('blocks unlock attempts during cooldown without password hashing', async () => {
    await expect(sessionService.unlock({ ...row(), retryAfter: new Date(Date.now() + 60000) }, 'password', user)).rejects.toMatchObject({ statusCode: 429 });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });
  it('revokes only the session being logged out', async () => {
    await sessionService.revoke(row());
    expect(prisma.authSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'test-session', generation: 0 } }));
  });
});
