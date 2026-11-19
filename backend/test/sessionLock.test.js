import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
vi.mock('../src/config/env.js', () => ({ env: { JWT_SECRET: 'test-secret', JWT_EXPIRES_IN: '12h' } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: {
  authSession: { create: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn() },
  user: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  $transaction: vi.fn(),
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
  prisma.$transaction.mockImplementation(fn => fn(prisma));
  prisma.authSession.updateMany.mockResolvedValue({ count: 1 });
  prisma.authSession.findUnique.mockResolvedValue(row());
  prisma.user.findUnique.mockResolvedValue(user);
  prisma.user.findFirst.mockResolvedValue(user);
  bcrypt.compare.mockResolvedValue(true);
});
describe('server-enforced session lock', () => {
  it('shortens the preference using the old idle deadline and preserves absolute expiry', async () => {
    const session = { ...row(), lastActiveAt: new Date(Date.now() - 45 * 60000) };
    prisma.user.findUnique.mockResolvedValue({ ...user, sessionIdleMinutes: 60 });
    prisma.authSession.findUnique.mockResolvedValue({ ...session, lastActiveAt: new Date() });
    const result = await sessionService.setIdleMinutes(session, 15);
    const change = prisma.authSession.updateMany.mock.calls[0][0];
    expect(change.where.lastActiveAt.gt.getTime()).toBe(change.data.lastActiveAt.getTime() - 61 * 60000);
    expect(change.where).toMatchObject({ id: session.id, userId: 1, generation: 0, revokedAt: null, lockedAt: null });
    expect(change.data).not.toHaveProperty('expiresAt');
    expect(result).toMatchObject({ idleMinutes: 15, locked: false, expiresAt: session.expiresAt.getTime() });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { sessionIdleMinutes: 15 } });
    expect(prisma.authSession.updateMany.mock.invocationCallOrder[0]).toBeLessThan(prisma.user.update.mock.invocationCallOrder[0]);
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ isolationLevel: 'Serializable' }));
  });
  it('does not change preferences when the session has expired, locked, or been revoked', async () => {
    prisma.authSession.updateMany.mockResolvedValue({ count: 0 });
    await expect(sessionService.setIdleMinutes(row(), 120)).rejects.toMatchObject({ statusCode: 401 });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
  it.each([0, 14, 121, 30.5])('rejects invalid inactivity preference %s without writes', async minutes => {
    await expect(sessionService.setIdleMinutes(row(), minutes)).rejects.toMatchObject({ statusCode: 400 });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
  it('propagates preference-save failure through the atomic transaction', async () => {
    prisma.user.update.mockRejectedValueOnce(new Error('Database unavailable'));
    await expect(sessionService.setIdleMinutes(row(), 15)).rejects.toThrow('Database unavailable');
    expect(prisma.authSession.findUnique).not.toHaveBeenCalled();
  });
  it('uses role defaults and personal inactivity preferences', async () => {
    expect(await sessionService.idleMinutes(1)).toBe(30);
    prisma.user.findUnique.mockResolvedValue({ role: 'PATIENT' });
    expect(await sessionService.idleMinutes(1)).toBe(60);
    prisma.user.findUnique.mockResolvedValue({ sessionIdleMinutes: 120 });
    expect(await sessionService.idleMinutes(1)).toBe(120);
  });
  it('ends idle sessions instead of asking for an unlock', async () => {
    prisma.authSession.findUnique.mockResolvedValue({ ...row(), lastActiveAt: new Date(Date.now() - 32 * 60000) });
    await expect(sessionService.inspect(payload)).rejects.toMatchObject({ statusCode: 401 });
  });
  it('rejects expired JWTs on session control endpoints', async () => {
    const req = { headers: { authorization: `Bearer ${jwt.sign({ ...payload, exp: 1 }, 'test-secret')}` }, originalUrl: '/api/auth/session' };
    const next = vi.fn(); await authenticateSessionControl(req, {}, next);
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 401 });
  });
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
    await expect(sessionService.activity(row())).rejects.toMatchObject({ statusCode: 401 });
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
