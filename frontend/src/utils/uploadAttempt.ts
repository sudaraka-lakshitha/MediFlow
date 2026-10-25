// Store only an opaque retry key and payload hash, never prescription contents.
const pending = new Map<number, { fingerprint: string; key: string }>();
export async function uploadAttemptKey(userId: number, payload: unknown) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  const fingerprint = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
  const storageKey = `mediflow:pending-upload:${userId}`;
  let previous = pending.get(userId);
  try { previous = JSON.parse(sessionStorage.getItem(storageKey) || 'null') || previous; } catch { /* memory fallback */ }
  const attempt = previous?.fingerprint === fingerprint ? previous : { fingerprint, key: crypto.randomUUID() };
  pending.set(userId, attempt);
  try { sessionStorage.setItem(storageKey, JSON.stringify(attempt)); } catch { /* memory fallback */ }
  return attempt.key;
}
export function completeUploadAttempt(userId: number) {
  pending.delete(userId);
  try { sessionStorage.removeItem(`mediflow:pending-upload:${userId}`); } catch { /* unavailable storage */ }
}
