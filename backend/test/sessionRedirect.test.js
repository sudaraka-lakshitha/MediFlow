import { afterEach, beforeEach, expect, it, vi } from 'vitest';
let api;
let replace;
beforeEach(async () => {
  vi.resetModules();
  const values = new Map([['mediflow_token', 'current'], ['mediflow_user', '{}']]);
  vi.stubGlobal('localStorage', {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  });
  replace = vi.fn();
  vi.stubGlobal('window', { location: { replace }, dispatchEvent: vi.fn() });
  ({ api } = await import('../../frontend/src/api/client'));
});
afterEach(() => vi.unstubAllGlobals());
const failure = (token = 'current', status = 401, url = '/navigation/attention') => ({
  response: { status }, config: { url, headers: { Authorization: `Bearer ${token}` } },
});
const reject = error => api.interceptors.response.handlers[0].rejected(error).catch(() => {});
it('redirects once and stops further requests after session expiry', async () => {
  await reject(failure());
  await reject(failure());
  expect(replace).toHaveBeenCalledExactlyOnceWith('/login?reason=session-ended');
  expect(localStorage.getItem('mediflow_token')).toBeNull();
  await expect(api.interceptors.request.handlers[0].fulfilled({ headers: {} })).rejects.toThrow('Session ended');
});
it('does not clear a newer session after an older request fails', async () => {
  await reject(failure('old-token'));
  expect(replace).not.toHaveBeenCalled();
  expect(localStorage.getItem('mediflow_token')).toBe('current');
});
it('keeps sessions on server failures', async () => {
  await reject(failure('current', 500));
  expect(replace).not.toHaveBeenCalled();
  expect(localStorage.getItem('mediflow_token')).toBe('current');
});
it('leaves failed login attempts on the login form', async () => {
  await reject(failure('current', 401, '/auth/login'));
  expect(replace).not.toHaveBeenCalled();
});
