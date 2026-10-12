import { z } from 'zod';

const birthDate = z.coerce.date().refine((value) => value <= new Date(), 'Date of birth cannot be in the future.');
const profileFields = {
  fullName: z.string().trim().min(2).max(150),
  email: z.string().email().max(190),
  phone: z.string().trim().regex(/^0\d{9}$/, 'Phone number must contain exactly 10 digits and start with 0.').optional().nullable().or(z.literal('')),
  dateOfBirth: birthDate.optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  allergies: z.string().trim().max(1000).optional().nullable(),
  chronicConditions: z.string().trim().max(1000).optional().nullable(),
};
const password = z.string().min(8, 'Password requires at least 8 characters.').max(72).regex(/[a-z]/, 'Password requires a lowercase letter.').regex(/[A-Z]/, 'Password requires an uppercase letter.').regex(/\d/, 'Password requires a number.').regex(/[^A-Za-z0-9]/, 'Password requires a symbol.');
export const createPatientSchema = z.object({
  ...profileFields,
  email: z.string().email().max(190).optional().nullable().or(z.literal('')),
  phone: z.string().trim().regex(/^0\d{9}$/, 'Phone number must contain exactly 10 digits and start with 0.'),
  dateOfBirth: birthDate,
  password: password.optional().or(z.literal('')),
  onlineAccess: z.boolean().default(true),
}).superRefine((data, context) => {
  if (data.onlineAccess && !data.email) context.addIssue({ code: 'custom', path: ['email'], message: 'Email is required when online access is enabled.' });
});
export const updatePatientSchema = z.object({
  ...profileFields,
  email: z.string().email().max(190).optional(),
});
export const updateOwnProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(150).optional(),
  phone: z.string().trim().regex(/^0\d{9}$/, 'Phone number must contain exactly 10 digits and start with 0.').optional().nullable().or(z.literal('')),
  dateOfBirth: birthDate.optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  allergies: z.string().trim().max(1000).optional().nullable(),
  chronicConditions: z.string().trim().max(1000).optional().nullable(),
});
export const patientPasswordSchema = z.object({ password: password.optional().or(z.literal('')) });
export const patientNoticeSchema = z.object({ title: z.string().trim().min(2).max(150), message: z.string().trim().min(2).max(1000) });
