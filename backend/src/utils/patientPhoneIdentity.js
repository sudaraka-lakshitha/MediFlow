import { AppError } from './AppError.js';

export const normalizePatientPhone = (value) => {
  const phone = String(value || '').trim();
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('94') ? `+${digits}` : digits.startsWith('0') ? `+94${digits.slice(1)}` : `+${digits}`;
};

export async function syncPatientPhoneIdentity(tx, userId, phone) {
  const normalized = normalizePatientPhone(phone);
  await tx.patientPhoneIdentity.deleteMany({ where: { userId } });
  if (!normalized) return;
  try {
    await tx.patientPhoneIdentity.create({ data: { userId, phone: normalized } });
  } catch (error) {
    if (error?.code === 'P2002') throw new AppError(409, 'An account already uses this phone number. Sign in or reset your password instead.');
    throw error;
  }
}
