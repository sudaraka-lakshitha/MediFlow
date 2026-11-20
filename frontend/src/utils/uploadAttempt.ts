// Gives each upload a retry key so a double click does not create two uploads. The prescription
// itself is never stored here.

import { createBrowserId, fingerprintPayload } from './browserCrypto';

// Store only an opaque retry key and payload hash, never prescription contents.
const pending = new Map<number, { fingerprint: string; key: string }>();
export async function uploadAttemptKey(userId: number, payload: unknown) {
  const fingerprint = await fingerprintPayload(payload);
  const storageKey = `mediflow:pending-upload:${userId}`;
  let previous = pending.get(userId);
  try { previous = JSON.parse(sessionStorage.getItem(storageKey) || 'null') || previous; } catch { /* memory fallback */ }
  const attempt = previous?.fingerprint === fingerprint ? previous : { fingerprint, key: createBrowserId() };
  pending.set(userId, attempt);
  try { sessionStorage.setItem(storageKey, JSON.stringify(attempt)); } catch { /* memory fallback */ }
  return attempt.key;
}
export function completeUploadAttempt(userId: number) {
  pending.delete(userId);
  try { sessionStorage.removeItem(`mediflow:pending-upload:${userId}`); } catch { /* unavailable storage */ }
}
