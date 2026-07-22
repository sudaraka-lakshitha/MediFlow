import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, selfResetPasswordSchema, verifyResetOtpSchema } from '../validators/auth.validator.js';
import { updateOwnProfileSchema } from '../validators/patient.validator.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

export const authRoutes = Router();
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  message: 'Too many sign-in attempts. Wait before trying again.',
});
const resetRequestLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 5,
  message: 'Too many password reset requests. Wait before requesting another code.',
});
const resetVerificationLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  message: 'Too many reset-code attempts. Wait before trying again.',
});
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
authRoutes.post('/register', validate({ body: registerSchema }), asyncHandler(authController.register));
authRoutes.post('/login', loginLimiter, validate({ body: loginSchema }), asyncHandler(authController.login));
authRoutes.post('/forgot-password', resetRequestLimiter, validate({ body: forgotPasswordSchema }), asyncHandler(authController.forgotPassword));
authRoutes.post('/verify-reset-otp', resetVerificationLimiter, validate({ body: verifyResetOtpSchema }), asyncHandler(authController.verifyResetOtp));
authRoutes.post('/reset-password', validate({ body: selfResetPasswordSchema }), asyncHandler(authController.selfResetPassword));
authRoutes.get('/me', authenticate, asyncHandler(authController.me));
authRoutes.post('/change-password', authenticate, validate({ body: changePasswordSchema }), asyncHandler(authController.changePassword));
authRoutes.patch('/profile', authenticate, validate({ body: updateOwnProfileSchema }), asyncHandler(authController.updateProfile));
