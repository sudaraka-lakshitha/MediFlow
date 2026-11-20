// COLLECTION PIN
// A paid order gets a 6-digit PIN that the customer shows when collecting.
// We store two versions: a one-way scrambled copy to check the PIN (it cannot be turned back into
// the PIN),
// and a locked (encrypted) copy so the receipt can be printed again. The PIN itself is never stored
// as plain text.

import crypto from 'node:crypto';
import { env } from '../config/env.js';

const encryptionKey = crypto.createHash('sha256').update(env.JWT_SECRET).digest();
// A random 6-digit PIN, for example 048213.
export const generatePickupPin = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
// The one-way scrambled copy used to check a PIN.
export const hashPickupPin = (requestId, pin) => crypto.createHmac('sha256', env.JWT_SECRET).update(`${requestId}:${pin}`).digest('hex');
// Does the typed PIN match? Compared in a way that does not leak timing hints.
export const verifyPickupPin = (requestId, pin, storedHash) => {
  if (!storedHash || !/^\d{6}$/.test(pin || '')) return false;
  const supplied = Buffer.from(hashPickupPin(requestId, pin), 'hex');
  const stored = Buffer.from(storedHash, 'hex');
  return supplied.length === stored.length && crypto.timingSafeEqual(supplied, stored);
};
// Lock the PIN so only the server can read it back (for reprinting a receipt).
export const encryptPickupPin = (pin) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(pin, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`;
};
// Unlock the PIN for printing.
export const decryptPickupPin = (value) => {
  const [ivValue, tagValue, encryptedValue] = String(value || '').split('.');
  if (!ivValue || !tagValue || !encryptedValue) return null;
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, Buffer.from(ivValue, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, 'base64url')), decipher.final()]).toString('utf8');
};
