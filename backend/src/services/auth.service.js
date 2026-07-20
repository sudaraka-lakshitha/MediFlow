import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { userRepository } from '../repositories/user.repository.js';
import { mailService } from './mail.service.js';

const safeUser = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  phone: user.phone,
  role: user.role,
  cashierAccess: user.cashierAccess,
  mustChangePassword: user.mustChangePassword,
  lastLoginAt: user.lastLoginAt,
  passwordChangedAt: user.passwordChangedAt,
});
const sign = (user) => jwt.sign(
  { role: user.role, version: user.tokenVersion },
  env.JWT_SECRET,
  { subject: String(user.id), expiresIn: env.JWT_EXPIRES_IN },
);

export const authService = {
  async register(data) {
    const email = data.email.trim().toLowerCase();
    if (await userRepository.findByEmail(email)) throw new AppError(409, 'An account already uses this email address.');
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({ data: { email, passwordHash, fullName: data.fullName.trim(), phone: data.phone, role: 'PATIENT' } });
      await tx.patientProfile.create({
        data: { userId: created.id, patientNumber: `PAT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, dateOfBirth: data.dateOfBirth },
      });
      return created;
    });
    return { token: sign(user), user: safeUser(user) };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password.');
    }
    const loggedInUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return { token: sign(loggedInUser), user: safeUser(loggedInUser) };
  },
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new AppError(400, 'The current password is incorrect.');
    }
    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      throw new AppError(400, 'The new password must be different from the current password.');
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
        tokenVersion: { increment: 1 },
      },
    });
    return {
      message: 'Password changed successfully. Other signed-in sessions have been revoked.',
      token: sign(updated),
      user: safeUser(updated),
    };
  },
  async beginSelfReset(data) {
    if (!mailService.isConfigured()) throw new AppError(503, 'Email password recovery is not configured. Ask the administrator to configure SMTP.');
    const response = { message: 'If an active account uses that email address, a reset code has been sent.', expiresInMinutes: env.PASSWORD_RESET_OTP_MINUTES };
    const user = await prisma.user.findUnique({ where: { email: data.email.trim().toLowerCase() } });
    if (!user || !user.active) return response;

    const existing = await prisma.passwordResetOtp.findUnique({ where: { userId: user.id } });
    const cooldownEndsAt = existing ? existing.requestedAt.getTime() + (env.PASSWORD_RESET_RESEND_SECONDS * 1000) : 0;
    if (cooldownEndsAt > Date.now()) return response;

    const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    const codeHash = crypto.createHmac('sha256', env.JWT_SECRET).update(`${user.id}:${otp}`).digest('hex');
    const expiresAt = new Date(Date.now() + (env.PASSWORD_RESET_OTP_MINUTES * 60_000));
    await prisma.passwordResetOtp.upsert({
      where: { userId: user.id },
      create: { userId: user.id, codeHash, expiresAt },
      update: { codeHash, expiresAt, requestedAt: new Date(), attempts: 0, usedAt: null },
    });
    try {
      await mailService.sendPasswordResetOtp({ email: user.email, fullName: user.fullName, otp, expiresInMinutes: env.PASSWORD_RESET_OTP_MINUTES });
    } catch (error) {
      await prisma.passwordResetOtp.deleteMany({ where: { userId: user.id, codeHash } });
      throw error;
    }
    return response;
  },
  async verifyResetOtp(email, otp) {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    const record = user ? await prisma.passwordResetOtp.findUnique({ where: { userId: user.id } }) : null;
    const invalid = !user || !user.active || !record || record.usedAt || record.expiresAt <= new Date() || record.attempts >= 5;
    if (invalid) throw new AppError(400, 'The reset code is invalid or has expired. Request a new code.');

    const suppliedHash = crypto.createHmac('sha256', env.JWT_SECRET).update(`${user.id}:${otp}`).digest();
    const storedHash = Buffer.from(record.codeHash, 'hex');
    if (storedHash.length !== suppliedHash.length || !crypto.timingSafeEqual(storedHash, suppliedHash)) {
      await prisma.passwordResetOtp.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      throw new AppError(400, 'The reset code is invalid or has expired. Request a new code.');
    }

    await prisma.passwordResetOtp.update({ where: { id: record.id }, data: { usedAt: new Date() } });
    const passwordKey = crypto.createHash('sha256').update(user.passwordHash).digest('hex').slice(0, 16);
    const resetToken = jwt.sign({ purpose: 'password-reset', passwordKey }, env.JWT_SECRET, { subject: String(user.id), expiresIn: '10m' });
    return { resetToken, expiresInMinutes: 10 };
  },
  async completeSelfReset(resetToken, newPassword) {
    let payload;
    try { payload = jwt.verify(resetToken, env.JWT_SECRET); } catch { throw new AppError(400, 'The password reset session is invalid or has expired.'); }
    if (payload.purpose !== 'password-reset') throw new AppError(400, 'Invalid password reset session.');
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user || !user.active) throw new AppError(400, 'Invalid password reset session.');
    const currentPasswordKey = crypto.createHash('sha256').update(user.passwordHash).digest('hex').slice(0, 16);
    if (payload.passwordKey !== currentPasswordKey) throw new AppError(400, 'This password reset session has already been used.');
    if (await bcrypt.compare(newPassword, user.passwordHash)) throw new AppError(400, 'The new password must be different from the current password.');
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await bcrypt.hash(newPassword, 12),
          mustChangePassword: false,
          passwordChangedAt: new Date(),
          tokenVersion: { increment: 1 },
        },
      }),
      prisma.passwordResetOtp.deleteMany({ where: { userId: user.id } }),
    ]);
    return { message: 'Password reset successfully. You can now sign in.', auditUserId: user.id };
  },
  async updateProfile(userId, data) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new AppError(404, 'User not found.');
      
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          fullName: data.fullName ? data.fullName.trim() : user.fullName,
          phone: data.phone !== undefined ? data.phone : user.phone,
        }
      });
      
      if (user.role === 'PATIENT') {
        await tx.patientProfile.update({
          where: { userId },
          data: {
            dateOfBirth: data.dateOfBirth !== undefined ? (data.dateOfBirth ? new Date(data.dateOfBirth) : null) : undefined,
            address: data.address !== undefined ? data.address : undefined,
            allergies: data.allergies !== undefined ? data.allergies : undefined,
            chronicConditions: data.chronicConditions !== undefined ? data.chronicConditions : undefined,
          }
        });
      }
      
      const refreshed = await tx.user.findUnique({
        where: { id: userId },
      });
      
      return {
        user: safeUser(refreshed)
      };
    });
  },
};
