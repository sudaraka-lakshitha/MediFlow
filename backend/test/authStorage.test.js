import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { clearSession, saveSession, sessionToken, sessionUser } from '../../frontend/src/auth/authStorage';
beforeEach(() => {
  const values = new Map();
  const tabValues = new Map();
  vi.stubGlobal('sessionStorage', {
    getItem: key => tabValues.get(key) ?? null,
    setItem: (key, value) => tabValues.set(key, String(value)),
    removeItem: key => tabValues.delete(key),
  });
  vi.stubGlobal('localStorage', {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  });
});
afterEach(() => vi.unstubAllGlobals());
it('keeps credentials in the current tab only and reads saved users', () => {
  saveSession('token', { id: 1 });
  expect(sessionToken()).toBe('token');
  expect(sessionUser()).toEqual({ id: 1 });
  expect(localStorage.getItem('mediflow_token')).toBeNull();
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
  sessionStorage.setItem('mediflow_user', '{"id":1}');
  expect(sessionUser()).toBeNull();
});
it('safely clears malformed saved sessions', () => {
  sessionStorage.setItem('mediflow_token', 'token');
  sessionStorage.setItem('mediflow_user', '{broken');
  expect(sessionUser()).toBeNull();
  expect(sessionToken()).toBeNull();
});
