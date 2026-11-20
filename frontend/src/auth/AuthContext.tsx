// Keeps the signed-in user for the whole website and provides sign-in / sign-out to every page.

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../api/client";
import { AuthContext, type AuthValue, type User } from "./AuthSession";
import { clearSession, saveSession, sessionToken, sessionUser } from "./authStorage";
import { setWorkspaceLocked } from './workspaceLock';
const storedUser = () => sessionUser<User>();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storedUser);
  const accept = (data: { token: string; user: User }) => {
    const changed = data.token !== sessionToken();
    saveSession(data.token, data.user);
    setUser(data.user);
    if (changed) { setWorkspaceLocked(false); window.dispatchEvent(new Event('mediflow:session-refresh')); }
  };
  useEffect(() => {
    const token = sessionToken();
    if (!token) return;
    let active = true;
    api
      .get("/auth/me")
      .then((response) => {
        if (!active || sessionToken() !== token) return;
        saveSession(token, response.data.user);
        setUser(response.data.user);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  const value = useMemo<AuthValue>(
    () => ({
      user,
      login: async (email, password) =>
        accept((await api.post("/auth/login", { email, password })).data),
      register: async (data) =>
        accept((await api.post("/auth/register", data)).data),
      passwordChanged: () => {
        if (user)
          accept({
            token: sessionToken() || "",
            user: { ...user, mustChangePassword: false },
          });
      },
      acceptSession: accept,
      logout: async () => {
        // Start server revocation with the captured token, then clear the tab
        // synchronously. Do not make local logout wait on a sleeping/offline API.
        const token = sessionToken();
        if (token) void api.post('/auth/session/logout', undefined, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => undefined);
        clearSession();
        setWorkspaceLocked(false);
        setUser(null);
      },
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
