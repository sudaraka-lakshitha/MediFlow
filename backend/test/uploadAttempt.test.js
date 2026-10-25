import { beforeEach, expect, it, vi } from 'vitest';
import { uploadAttemptKey, completeUploadAttempt } from '../../frontend/src/utils/uploadAttempt.ts';
beforeEach(() => {
  const storage = new Map();
  vi.stubGlobal('sessionStorage', { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) });
  completeUploadAttempt(7);
});
it('reuses an attempt for an unchanged payload until success', async () => {
  const payload = { fileBase64: 'test', patientNote: 'Request' };
  const key = await uploadAttemptKey(7, payload);
  expect(await uploadAttemptKey(7, payload)).toBe(key);
  expect(sessionStorage.getItem('mediflow:pending-upload:7')).not.toContain('Request');
  completeUploadAttempt(7);
  expect(await uploadAttemptKey(7, payload)).not.toBe(key);
});
it('uses separate attempts for changed content and different patients', async () => {
  const key = await uploadAttemptKey(7, { text: 'first' });
  expect(await uploadAttemptKey(7, { text: 'second' })).not.toBe(key);
  expect(await uploadAttemptKey(8, { text: 'first' })).not.toBe(key);
});
