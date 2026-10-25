import { afterEach, beforeEach, expect, it, vi } from 'vitest';
let api;
let replace;
beforeEach(async () => {
  vi.resetModules();
  const values = new Map([['mediflow_token', 'current'], ['mediflow_user', '{}']]);
  vi.stubGlobal('localStorage', { removeItem: vi.fn() });
  vi.stubGlobal('sessionStorage', {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  });
  replace = vi.fn();
  const events = new EventTarget();
  vi.stubGlobal('window', { location: { replace }, dispatchEvent: event => events.dispatchEvent(event), addEventListener: (...args) => events.addEventListener(...args), removeEventListener: (...args) => events.removeEventListener(...args) });
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
  expect(sessionStorage.getItem('mediflow_token')).toBeNull();
  await expect(api.interceptors.request.handlers[0].fulfilled({ headers: {} })).rejects.toThrow('Session ended');
});
it('does not clear a newer session after an older request fails', async () => {
  await reject(failure('old-token'));
  expect(replace).not.toHaveBeenCalled();
  expect(sessionStorage.getItem('mediflow_token')).toBe('current');
});
it('keeps sessions on server failures', async () => {
  await reject(failure('current', 500));
  expect(replace).not.toHaveBeenCalled();
  expect(sessionStorage.getItem('mediflow_token')).toBe('current');
});
it('leaves failed login attempts on the login form', async () => {
  await reject(failure('current', 401, '/auth/login'));
  expect(replace).not.toHaveBeenCalled();
});
it('waits for an in-flight save before leaving the page', async () => {
  const { trackWrite } = await import('../../frontend/src/auth/workspaceLock');
  trackWrite(1);
  await reject(failure());
  expect(replace).not.toHaveBeenCalled();
  trackWrite(-1);
  expect(replace).toHaveBeenCalledExactlyOnceWith('/login?reason=session-ended');
});
