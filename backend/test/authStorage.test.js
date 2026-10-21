import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { clearSession, saveSession, sessionToken, sessionUser } from '../../frontend/src/auth/authStorage';
beforeEach(() => {
  const values = new Map();
  vi.stubGlobal('localStorage', {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  });
});
afterEach(() => vi.unstubAllGlobals());
it('retains existing persistent sessions and reads saved users', () => {
  saveSession('token', { id: 1 });
  expect(sessionToken()).toBe('token');
  expect(sessionUser()).toEqual({ id: 1 });
});
it('clears only authentication, preserving printer preferences', () => {
  localStorage.setItem('printer', '58');
  saveSession('token', { id: 1 });
  clearSession();
  expect(sessionToken()).toBeNull();
  expect(sessionUser()).toBeNull();
  expect(localStorage.getItem('printer')).toBe('58');
});
it('does not trust a saved user without a token', () => {
  localStorage.setItem('mediflow_user', '{"id":1}');
  expect(sessionUser()).toBeNull();
});
it('safely clears malformed saved sessions', () => {
  localStorage.setItem('mediflow_token', 'token');
  localStorage.setItem('mediflow_user', '{broken');
  expect(sessionUser()).toBeNull();
  expect(sessionToken()).toBeNull();
});
