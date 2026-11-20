// Input rules for patient profiles and notices. Wrong or missing input is stopped here with a clear
// message, before it reaches the services.

import { personNameSchema } from './personName.js';
import { z } from 'zod';
import { phoneSchema } from './phone.js';
import { notFutureCalendarDate } from './calendar.js';

const birthDate = notFutureCalendarDate('Date of birth cannot be in the future.');
const profileFields = {
  fullName: personNameSchema,
  email: z.string().email().max(190),
  phone: phoneSchema.optional().nullable().or(z.literal('')),
  dateOfBirth: birthDate.optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  allergies: z.string().trim().max(1000).optional().nullable(),
  chronicConditions: z.string().trim().max(1000).optional().nullable(),
};
const password = z.string().min(8, 'Password requires at least 8 characters.').max(72).regex(/[a-z]/, 'Password requires a lowercase letter.').regex(/[A-Z]/, 'Password requires an uppercase letter.').regex(/\d/, 'Password requires a number.').regex(/[^A-Za-z0-9]/, 'Password requires a symbol.');
export const createPatientSchema = z.object({
  ...profileFields,
  email: z.string().email().max(190).optional().nullable().or(z.literal('')),
  phone: phoneSchema,
  dateOfBirth: birthDate,
  password: password.optional().or(z.literal('')),
  onlineAccess: z.boolean().default(true),
}).superRefine((data, context) => {
  if (data.onlineAccess && !data.email) context.addIssue({ code: 'custom', path: ['email'], message: 'Email is required when online access is enabled.' });
});
export const updatePatientSchema = z.object({
  ...profileFields,
  expectedUpdatedAt: z.iso.datetime(),
  email: z.string().email().max(190).optional(),
});
export const updateOwnProfileSchema = z.object({
  expectedUpdatedAt: z.iso.datetime(),
  fullName: personNameSchema.optional(),
  phone: phoneSchema.optional().nullable().or(z.literal('')),
  dateOfBirth: birthDate.optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  allergies: z.string().trim().max(1000).optional().nullable(),
  chronicConditions: z.string().trim().max(1000).optional().nullable(),
});
export const patientPasswordSchema = z.object({ password: password.optional().or(z.literal('')) });
export const patientNoticeSchema = z.object({ title: z.string().trim().min(2).max(150), message: z.string().trim().min(2).max(1000) });
