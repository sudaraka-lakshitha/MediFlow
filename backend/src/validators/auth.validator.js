// Input rules for signing in, registering, passwords and the auto-lock session. Wrong or missing
// input is stopped here with a clear message, before it reaches the services.

import { personNameSchema } from './personName.js';
import { z } from 'zod';
import { phoneSchema as phone } from './phone.js';
import { notFutureCalendarDate } from './calendar.js';

const password = z.string().min(8, 'Password requires at least 8 characters.').max(72).regex(/[a-z]/, 'Password requires a lowercase letter.').regex(/[A-Z]/, 'Password requires an uppercase letter.').regex(/\d/, 'Password requires a number.').regex(/[^A-Za-z0-9]/, 'Password requires a symbol.');
const birthDate = notFutureCalendarDate('Date of birth cannot be in the future.');
export const loginSchema = z.object({ email: z.string().email().max(190), password: z.string().min(1) });
export const registerSchema = z.object({
  fullName: personNameSchema,
  email: z.string().email().max(190),
  password,
  phone,
  dateOfBirth: birthDate,
});
export const staffSchema = z.object({
  fullName: personNameSchema,
  email: z.string().email().max(190),
  password,
  phone: phone.optional().nullable().or(z.literal('')),
  role: z.enum(['ADMIN', 'PHARMACIST', 'CASHIER']),
  cashierAccess: z.boolean().default(false),
  pharmacyReconciliationAccess: z.boolean().default(false),
  deliveryRefundApprovalAccess: z.boolean().default(false),
});
export const staffUpdateSchema = z.object({
  fullName: personNameSchema,
  email: z.string().email().max(190),
  phone: phone.optional().nullable().or(z.literal('')),
  role: z.enum(['ADMIN', 'PHARMACIST', 'CASHIER']),
  cashierAccess: z.boolean().default(false),
  pharmacyReconciliationAccess: z.boolean().optional(),
  deliveryRefundApprovalAccess: z.boolean().optional(),
});
export const resetPasswordSchema = z.object({ password });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password });
export const forgotPasswordSchema = z.object({ email: z.string().email().max(190) });
export const verifyResetOtpSchema = z.object({
  email: z.string().email().max(190),
  otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit code from your email.'),
});
export const selfResetPasswordSchema = z.object({ resetToken: z.string().min(20), newPassword: password });
