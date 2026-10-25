import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { serializable } from '../utils/serializable.js';

export const WARNING_MS = 60_000;
const MAX_MS = 8 * 60 * 60_000;
const tokenFor = (user, id, generation) => jwt.sign(
  { role: user.role, version: user.tokenVersion, sid: id, generation },
  env.JWT_SECRET, { subject: String(user.id), expiresIn: env.JWT_EXPIRES_IN },
);
const expiryFor = token => new Date(Math.min(jwt.decode(token).exp * 1000, Date.now() + MAX_MS));
export const sessionView = (session, idleMinutes, now = Date.now()) => {
  const warningAt = new Date(session.lastActiveAt).getTime() + idleMinutes * 60_000;
  const expiresAt = new Date(session.expiresAt).getTime();
  return { serverNow: now, warningAt, lockAt: Math.min(warningAt + WARNING_MS, expiresAt), expiresAt,
    locked: Boolean(session.lockedAt) || now >= Math.min(warningAt + WARNING_MS, expiresAt), idleMinutes };
};

export const sessionService = {
  async issue(user) {
    const id = crypto.randomUUID();
    const token = tokenFor(user, id, 0);
    await prisma.authSession.create({ data: { id, userId: user.id, expiresAt: expiryFor(token) } });
    return token;
  },
  async inspect(payload) {
    if (typeof payload.sid !== 'string' || !Number.isInteger(payload.generation)) throw new AppError(401, 'Please sign in again to start a secure session.');
    const idleMinutes = await this.idleMinutes(Number(payload.sub));
    const now = new Date();
    // Atomic transition: activity cannot revive a deadline that already passed.
    await prisma.authSession.updateMany({
      where: { id: payload.sid, userId: Number(payload.sub), generation: payload.generation, revokedAt: null, lockedAt: null,
        OR: [{ lastActiveAt: { lte: new Date(now.getTime() - idleMinutes * 60_000 - WARNING_MS) } }, { expiresAt: { lte: now } }] },
      data: { revokedAt: now },
    });
    const session = await prisma.authSession.findUnique({ where: { id: payload.sid } });
    if (!session || session.userId !== Number(payload.sub) || session.revokedAt || session.generation !== payload.generation || new Date(session.expiresAt) <= now || new Date(session.lastActiveAt).getTime() + idleMinutes * 60_000 + WARNING_MS <= now.getTime()) {
      throw new AppError(401, 'This session has ended. Please sign in again.');
    }
    return { session, view: sessionView(session, idleMinutes) };
  },
  async activity(session) {
    const sessionIdleMinutes = await this.idleMinutes(session.userId);
    const now = new Date();
    const updated = await prisma.authSession.updateMany({
      where: { id: session.id, generation: session.generation, revokedAt: null, lockedAt: null,
        expiresAt: { gt: now }, lastActiveAt: { gt: new Date(now.getTime() - sessionIdleMinutes * 60_000 - WARNING_MS) } },
      data: { lastActiveAt: now },
    });
    if (!updated.count) throw new AppError(401, 'This session has ended. Please sign in again.');
    return sessionView({ ...session, lastActiveAt: now }, sessionIdleMinutes);
  },
  async lock(session) {
    await prisma.authSession.updateMany({ where: { id: session.id, generation: session.generation, revokedAt: null }, data: { lockedAt: new Date() } });
  },
  async idleMinutes(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { sessionIdleMinutes: true, role: true } });
    return user?.sessionIdleMinutes ?? (user?.role === 'PATIENT' ? 60 : 30);
  },
  async setIdleMinutes(session, minutes) {
    if (!Number.isInteger(minutes) || minutes < 15 || minutes > 120) throw new AppError(400, 'Choose an inactivity timeout between 15 and 120 minutes.');
    return serializable(async tx => {
      const user = await tx.user.findUnique({ where: { id: session.userId }, select: { sessionIdleMinutes: true, role: true } });
      if (!user) throw new AppError(401, 'This session has ended. Please sign in again.');
      const previousMinutes = user.sessionIdleMinutes ?? (user.role === 'PATIENT' ? 60 : 30);
      const now = new Date();
      // Saving a preference is activity under the OLD policy. Applying the new
      // shorter timeout first could expire the very session making this change.
      const updated = await tx.authSession.updateMany({
        where: { id: session.id, userId: session.userId, generation: session.generation, revokedAt: null, lockedAt: null,
          expiresAt: { gt: now }, lastActiveAt: { gt: new Date(now.getTime() - previousMinutes * 60_000 - WARNING_MS) } },
        data: { lastActiveAt: now },
      });
      if (!updated.count) throw new AppError(401, 'This session has ended. Please sign in again.');
      await tx.user.update({ where: { id: session.userId }, data: { sessionIdleMinutes: minutes } });
      const saved = await tx.authSession.findUnique({ where: { id: session.id } });
      return sessionView(saved, minutes);
    });
  },
  async revoke(session) {
    await prisma.authSession.updateMany({ where: { id: session.id, generation: session.generation }, data: { revokedAt: new Date() } });
  },
  async unlock(session, password, authenticatedUser) {
    const now = new Date();
    if (session.retryAfter && session.retryAfter > now) throw new AppError(429, 'Too many attempts. Wait 15 minutes before trying again.');
    // Reserve an attempt in the database before password hashing (also across instances).
    const attempt = await prisma.authSession.updateMany({ where: { id: session.id, generation: session.generation, revokedAt: null,
      OR: [{ retryAfter: null }, { retryAfter: { lte: now } }] },
      data: { unlockAttempts: { increment: 1 }, retryAfter: new Date(now.getTime() + 2000) },
    });
    if (!attempt.count) throw new AppError(429, 'Please wait before trying again.');
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user?.active || user.tokenVersion !== authenticatedUser.tokenVersion) throw new AppError(401, 'This session has been revoked.');
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      const count = session.retryAfter && session.retryAfter <= now && session.unlockAttempts >= 5 ? 1 : session.unlockAttempts + 1;
      await prisma.authSession.updateMany({ where: { id: session.id, generation: session.generation },
        data: { unlockAttempts: count, retryAfter: new Date(Date.now() + (count >= 5 ? 15 * 60_000 : 2000)) } });
      throw new AppError(400, 'Incorrect password. Your workspace remains locked.');
    }
    const generation = session.generation + 1;
    const token = tokenFor(user, session.id, generation);
    const expiresAt = expiryFor(token);
    const changed = await prisma.authSession.updateMany({ where: { id: session.id, generation: session.generation, revokedAt: null },
      data: { generation, lockedAt: null, lastActiveAt: new Date(), expiresAt, unlockAttempts: 0, retryAfter: null } });
    if (!changed.count) throw new AppError(409, 'The session changed. Try again.');
    const sessionIdleMinutes = await this.idleMinutes(session.userId);
    return { token, session: sessionView({ lastActiveAt: new Date(), expiresAt }, sessionIdleMinutes) };
  },
};
