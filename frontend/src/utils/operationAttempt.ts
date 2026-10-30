const attempts = new Map<string, string>();
export const retryProtectedPath = (method: string, path: string) => method.toUpperCase() === 'POST'
  && /^\/(?:sales\/(?:retail|\d+\/pay)|inventory\/batches(?:\/\d+\/(?:adjust|dispose-expired))?|payment-requests\/retail|prescriptions\/\d+\/refill)$/.test(path);

export async function operationAttempt(userId: number, path: string, payload: unknown) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ path, payload })));
  const hash = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
  const storageKey = `mediflow:operation:${userId}:${hash}`;
  let key = attempts.get(storageKey);
  try { key = sessionStorage.getItem(storageKey) || key; } catch { /* memory fallback */ }
  key ||= crypto.randomUUID();
  attempts.set(storageKey, key);
  try { sessionStorage.setItem(storageKey, key); } catch { /* no clinical data is stored */ }
  return { storageKey, key };
}
export function finishOperation(storageKey?: string) {
  if (!storageKey) return;
  attempts.delete(storageKey);
  try { sessionStorage.removeItem(storageKey); } catch { /* memory fallback */ }
}
