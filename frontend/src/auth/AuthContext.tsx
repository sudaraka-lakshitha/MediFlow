import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../api/client";
import { AuthContext, type AuthValue, type User } from "./AuthSession";
const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("mediflow_user") || "null");
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storedUser);
  const accept = (data: { token: string; user: User }) => {
    localStorage.setItem("mediflow_token", data.token);
    localStorage.setItem("mediflow_user", JSON.stringify(data.user));
    setUser(data.user);
  };
  useEffect(() => {
    if (!localStorage.getItem("mediflow_token")) return;
    api
      .get("/auth/me")
      .then((response) => {
        localStorage.setItem(
          "mediflow_user",
          JSON.stringify(response.data.user),
        );
        setUser(response.data.user);
      })
      .catch(() => undefined);
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
            token: localStorage.getItem("mediflow_token") || "",
            user: { ...user, mustChangePassword: false },
          });
      },
      acceptSession: accept,
      logout: () => {
        localStorage.removeItem("mediflow_token");
        localStorage.removeItem("mediflow_user");
        setUser(null);
      },
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
