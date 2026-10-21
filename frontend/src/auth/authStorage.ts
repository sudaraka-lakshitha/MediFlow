// Keep sign-in across tab/browser closure; the server controls token expiry.

export const sessionToken = () => localStorage.getItem('mediflow_token');

export function sessionUser<T>(): T | null {
  if (!sessionToken()) return null;
  try {
    return JSON.parse(localStorage.getItem('mediflow_user') || 'null') as T | null;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(token: string, user: unknown) {
  localStorage.setItem('mediflow_token', token);
  localStorage.setItem('mediflow_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('mediflow_token');
  localStorage.removeItem('mediflow_user');
}
