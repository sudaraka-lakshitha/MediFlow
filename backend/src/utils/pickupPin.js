import crypto from 'node:crypto';
import { env } from '../config/env.js';

const encryptionKey = crypto.createHash('sha256').update(env.JWT_SECRET).digest();
export const generatePickupPin = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
export const hashPickupPin = (requestId, pin) => crypto.createHmac('sha256', env.JWT_SECRET).update(`${requestId}:${pin}`).digest('hex');
export const verifyPickupPin = (requestId, pin, storedHash) => {
  if (!storedHash || !/^\d{6}$/.test(pin || '')) return false;
  const supplied = Buffer.from(hashPickupPin(requestId, pin), 'hex');
  const stored = Buffer.from(storedHash, 'hex');
  return supplied.length === stored.length && crypto.timingSafeEqual(supplied, stored);
};
export const encryptPickupPin = (pin) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(pin, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`;
};
export const decryptPickupPin = (value) => {
  const [ivValue, tagValue, encryptedValue] = String(value || '').split('.');
  if (!ivValue || !tagValue || !encryptedValue) return null;
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, Buffer.from(ivValue, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, 'base64url')), decipher.final()]).toString('utf8');
};
