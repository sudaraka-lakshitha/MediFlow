// Receives the web requests for signing in, registering, passwords and the auto-lock session, calls
// the matching service, writes the audit log entry and sends the reply.
// The real rules are in services/auth.service.js. To trace a button: route -> this controller ->
// service.

import { authService } from '../services/auth.service.js';
import { prisma } from '../config/prisma.js';
import { recordRequestAudit } from '../services/audit.service.js';

export const authController = {
  register: async (req, res) => {
    const result = await authService.register(req.body);
    await recordRequestAudit(req, { userId: result.user.id, action: 'REGISTER', entityType: 'USER', entityId: result.user.id });
    res.status(201).json(result);
  },
  login: async (req, res) => {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      await recordRequestAudit(req, { userId: result.user.id, action: 'LOGIN', entityType: 'USER', entityId: result.user.id });
      res.json(result);
    } catch (error) {
      const attemptedUser = await prisma.user.findUnique({
        where: { email: req.body.email.trim().toLowerCase() },
        select: { id: true },
      });
      await recordRequestAudit(req, {
        userId: attemptedUser?.id,
        action: 'LOGIN_FAILED',
        entityType: 'USER',
        entityId: attemptedUser?.id,
        details: { email: req.body.email.trim().toLowerCase() },
        success: false,
      });
      throw error;
    }
  },
  me: async (req, res) => {
    const user = { ...req.user };
    if (user.role === 'PATIENT') {
      user.patientProfile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    }
    res.json({ user });
  },
  changePassword: async (req, res) => {
    const result = await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    await recordRequestAudit(req, { action: 'PASSWORD_CHANGED', entityType: 'USER', entityId: req.user.id });
    res.json(result);
  },
  forgotPassword: async (req, res) => {
    const result = await authService.beginSelfReset(req.body);
    const account = await prisma.user.findUnique({ where: { email: req.body.email.trim().toLowerCase() }, select: { id: true } });
    if (account) await recordRequestAudit(req, { userId: account.id, action: 'PASSWORD_RESET_OTP_REQUESTED', entityType: 'USER', details: { email: req.body.email } });
    res.json(result);
  },
  verifyResetOtp: async (req, res) => {
    const result = await authService.verifyResetOtp(req.body.email, req.body.otp);
    const account = await prisma.user.findUnique({ where: { email: req.body.email.trim().toLowerCase() }, select: { id: true } });
    if (account) await recordRequestAudit(req, { userId: account.id, action: 'PASSWORD_RESET_OTP_VERIFIED', entityType: 'USER', details: { email: req.body.email } });
    res.json(result);
  },
  selfResetPassword: async (req, res) => {
    const { auditUserId, ...result } = await authService.completeSelfReset(req.body.resetToken, req.body.newPassword);
    await recordRequestAudit(req, { userId: auditUserId, action: 'SELF_PASSWORD_RESET', entityType: 'USER', entityId: auditUserId });
    res.json(result);
  },
  updateProfile: async (req, res) => {
    const result = await authService.updateProfile(req.user.id, req.body);
    await recordRequestAudit(req, { userId: req.user.id, action: 'PROFILE_UPDATED', entityType: 'USER', entityId: req.user.id });
    res.json(result);
  },
};
