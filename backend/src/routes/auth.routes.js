import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate, authenticateSessionControl } from '../middleware/authenticate.js';
import { z } from 'zod';
import { sessionService } from '../services/session.service.js';
import { recordRequestAudit } from '../services/audit.service.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, selfResetPasswordSchema, verifyResetOtpSchema } from '../validators/auth.validator.js';
import { updateOwnProfileSchema } from '../validators/patient.validator.js';
import { createSharedRateLimiter as createRateLimiter } from '../middleware/sharedRateLimit.js';

export const authRoutes = Router();
const loginLimiter = createRateLimiter({
  namespace: 'login', ipMax: 60,
  windowMs: 15 * 60_000,
  max: 10,
  message: 'Too many sign-in attempts. Wait before trying again.',
});
const resetRequestLimiter = createRateLimiter({
  namespace: 'reset-request', ipMax: 20,
  windowMs: 15 * 60_000,
  max: 5,
  message: 'Too many password reset requests. Wait before requesting another code.',
});
const resetVerificationLimiter = createRateLimiter({
  namespace: 'reset-verify', ipMax: 40,
  windowMs: 15 * 60_000,
  max: 10,
  message: 'Too many reset-code attempts. Wait before trying again.',
});
const registrationLimiter = createRateLimiter({ namespace: 'register', windowMs: 60 * 60_000, max: 5, ipMax: 20,
  message: 'Too many account creation attempts. Please wait before trying again.' });
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     security: []
 *     summary: Authenticate a user and return a JWT
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [email, password], properties: { email: { type: string }, password: { type: string } } } } } }
 *     responses: { '200': { description: Authenticated }, '401': { description: Invalid credentials } }
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     security: []
 *     summary: Register a patient account
 *     responses: { '201': { description: Patient registered } }
 */
authRoutes.post('/register', registrationLimiter, validate({ body: registerSchema }), asyncHandler(authController.register));
authRoutes.post('/login', loginLimiter, validate({ body: loginSchema }), asyncHandler(authController.login));
authRoutes.post('/forgot-password', resetRequestLimiter, validate({ body: forgotPasswordSchema }), asyncHandler(authController.forgotPassword));
authRoutes.post('/verify-reset-otp', resetVerificationLimiter, validate({ body: verifyResetOtpSchema }), asyncHandler(authController.verifyResetOtp));
authRoutes.post('/reset-password', validate({ body: selfResetPasswordSchema }), asyncHandler(authController.selfResetPassword));
authRoutes.get('/me', authenticate, asyncHandler(authController.me));
authRoutes.get('/session', authenticateSessionControl, (req, res) => res.json({ session: req.sessionView }));
authRoutes.put('/session/preferences', authenticate,
  validate({ body: z.object({ idleMinutes: z.number().int().min(15).max(120) }) }),
  asyncHandler(async (req, res) => {
    res.json({ session: await sessionService.setIdleMinutes(req.authSession, req.body.idleMinutes) });
  }));
authRoutes.post('/session/activity', authenticateSessionControl, asyncHandler(async (req, res) => {
  res.json({ session: await sessionService.activity(req.authSession) });
}));
authRoutes.post('/session/lock', authenticateSessionControl, asyncHandler(async (req, res) => {
  await sessionService.lock(req.authSession);
  await recordRequestAudit(req, { action: 'SESSION_LOCKED', entityType: 'USER', entityId: req.user.id });
  res.json({ message: 'Workspace locked.' });
}));
authRoutes.post('/session/unlock', authenticateSessionControl,
  validate({ body: z.object({ password: z.string().min(1).max(256) }) }),
  asyncHandler(async (req, res) => {
    try {
      const result = await sessionService.unlock(req.authSession, req.body.password, req.user);
      await recordRequestAudit(req, { action: 'SESSION_UNLOCKED', entityType: 'USER', entityId: req.user.id });
      res.json(result);
    } catch (error) {
      await recordRequestAudit(req, { action: 'SESSION_UNLOCK_FAILED', entityType: 'USER', entityId: req.user.id, success: false });
      throw error;
    }
  }));
authRoutes.post('/session/logout', authenticateSessionControl, asyncHandler(async (req, res) => {
  await sessionService.revoke(req.authSession);
  await recordRequestAudit(req, { action: 'LOGOUT', entityType: 'USER', entityId: req.user.id });
  res.json({ message: 'Signed out.' });
}));
authRoutes.post('/change-password', authenticate, validate({ body: changePasswordSchema }), asyncHandler(authController.changePassword));
authRoutes.patch('/profile', authenticate, validate({ body: updateOwnProfileSchema }), asyncHandler(authController.updateProfile));
