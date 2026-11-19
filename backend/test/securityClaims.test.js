import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from '../src/services/auth.service.js';
import { userService } from '../src/services/user.service.js';
const { db } = vi.hoisted(() => ({ db: { user: { findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn(), count: vi.fn() }, passwordResetOtp: { findUnique: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() }, $transaction: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/config/env.js', () => ({ env: { JWT_SECRET: 'test-only-secret-not-a-real-credential-123456789' } }));
vi.mock('../src/services/mail.service.js', () => ({ mailService: {} }));
vi.mock('../src/config/logger.js', () => ({ logger: {} }));
vi.mock('bcrypt', () => ({ default: { hash: async value => `hash-${value}`, compare: async () => false } }));
const secret = 'test-only-secret-not-a-real-credential-123456789';
const user = { id: 1, passwordHash: 'hash-before', active: true, role: 'ADMIN', tokenVersion: 2 };
const resetToken = (version = 2) => jwt.sign({ purpose: 'password-reset', passwordKey: crypto.createHash('sha256').update(user.passwordHash).digest('hex').slice(0, 16), tokenVersion: version }, secret, { subject: '1', expiresIn: '10m' });
beforeEach(() => {
  vi.resetAllMocks();
  db.user.findUnique.mockResolvedValue({ ...user });
  db.$transaction.mockImplementation(async fn => fn(db));
});
describe('atomic password reset claims', () => {
  it('only one concurrent verifier can consume the same OTP', async () => {
    const record = { id: 2, codeHash: crypto.createHmac('sha256', secret).update('1:123456').digest('hex'), expiresAt: new Date(Date.now() + 60000), attempts: 0, usedAt: null };
    db.passwordResetOtp.findUnique.mockResolvedValue(record);
    let used = false;
    db.passwordResetOtp.updateMany.mockImplementation(async () => { if (used) return { count: 0 }; used = true; return { count: 1 }; });
    const results = await Promise.allSettled([authService.verifyResetOtp('test@example.invalid', '123456'), authService.verifyResetOtp('test@example.invalid', '123456')]);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(db.passwordResetOtp.updateMany.mock.calls[0][0].where).toMatchObject({ id: 2, codeHash: record.codeHash, usedAt: null, attempts: { lt: 5 } });
    expect(db.passwordResetOtp.updateMany.mock.calls[0][0].where.expiresAt.gt).toBeInstanceOf(Date);
  });
  it('only one concurrent reset may replace the password', async () => {
    let claimed = false;
    db.user.updateMany.mockImplementation(async () => { if (claimed) return { count: 0 }; claimed = true; return { count: 1 }; });
    const results = await Promise.allSettled([authService.completeSelfReset(resetToken(), 'replacement-a'), authService.completeSelfReset(resetToken(), 'replacement-b')]);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(db.user.updateMany.mock.calls[0][0].where).toEqual({ id: 1, active: true, passwordHash: 'hash-before', tokenVersion: 2 });
    expect(db.passwordResetOtp.deleteMany).toHaveBeenCalledTimes(1);
  });
  it('rejects a reset token revoked by a session-version change', async () => {
    await expect(authService.completeSelfReset(resetToken(1), 'replacement')).rejects.toThrow('revoked');
    expect(db.user.updateMany).not.toHaveBeenCalled();
  });
  it('rejects a stale claim without deleting a newer OTP', async () => {
    db.user.updateMany.mockResolvedValue({ count: 0 });
    await expect(authService.completeSelfReset(resetToken(), 'replacement')).rejects.toThrow('already been used');
    expect(db.passwordResetOtp.deleteMany).not.toHaveBeenCalled();
  });
});
describe('last administrator transaction boundary', () => {
  it.each(['remove','setActive','update'])('protects the final admin during %s', async action => {
    db.user.count.mockResolvedValue(1);
    const operation = action === 'update' ? userService.update(1, { role: 'CASHIER' }) : action === 'setActive' ? userService.setActive(1, false) : userService.remove(1);
    await expect(operation).rejects.toThrow('At least one active administrator');
    expect(db.user.update).not.toHaveBeenCalled();
    expect(db.$transaction.mock.calls[0][1]).toMatchObject({ isolationLevel: 'Serializable' });
  });
  it('rechecks the last-admin invariant after a concurrent-write retry', async () => {
    db.user.count.mockResolvedValueOnce(2).mockResolvedValueOnce(1);
    db.user.update.mockRejectedValueOnce(Object.assign(new Error('write conflict'), { code: 'P2034' }));
    await expect(userService.remove(1)).rejects.toThrow('At least one active administrator');
    expect(db.$transaction).toHaveBeenCalledTimes(2);
    expect(db.user.update).toHaveBeenCalledTimes(1);
  });
});
