import { z } from 'zod';

const password = z.string().min(8, 'Password requires at least 8 characters.').max(72).regex(/[a-z]/, 'Password requires a lowercase letter.').regex(/[A-Z]/, 'Password requires an uppercase letter.').regex(/\d/, 'Password requires a number.').regex(/[^A-Za-z0-9]/, 'Password requires a symbol.');
const phone = z.string().trim().regex(/^0\d{9}$/, 'Phone number must contain exactly 10 digits and start with 0.');
const birthDate = z.coerce.date().refine((value) => value <= new Date(), 'Date of birth cannot be in the future.');
export const loginSchema = z.object({ email: z.string().email().max(190), password: z.string().min(1) });
export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().email().max(190),
  password,
  phone,
  dateOfBirth: birthDate,
});
export const staffSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().email().max(190),
  password,
  phone: phone.optional().nullable().or(z.literal('')),
  role: z.enum(['ADMIN', 'PHARMACIST', 'CASHIER']),
  cashierAccess: z.boolean().default(false),
});
export const staffUpdateSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().email().max(190),
  phone: phone.optional().nullable().or(z.literal('')),
  role: z.enum(['ADMIN', 'PHARMACIST', 'CASHIER']),
  cashierAccess: z.boolean().default(false),
});
export const resetPasswordSchema = z.object({ password });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password });
export const forgotPasswordSchema = z.object({ email: z.string().email().max(190) });
export const verifyResetOtpSchema = z.object({
  email: z.string().email().max(190),
  otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit code from your email.'),
});
export const selfResetPasswordSchema = z.object({ resetToken: z.string().min(20), newPassword: password });
