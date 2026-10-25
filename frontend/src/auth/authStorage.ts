// Tab-scoped credentials. Do not revive older persistent logins.
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('mediflow_token');
  localStorage.removeItem('mediflow_user');
}

export const sessionToken = () => sessionStorage.getItem('mediflow_token');

export function sessionUser<T>(): T | null {
  if (!sessionToken()) return null;
  try {
    return JSON.parse(sessionStorage.getItem('mediflow_user') || 'null') as T | null;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(token: string, user: unknown) {
  sessionStorage.setItem('mediflow_token', token);
  sessionStorage.setItem('mediflow_user', JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem('mediflow_token');
  sessionStorage.removeItem('mediflow_user');
}
