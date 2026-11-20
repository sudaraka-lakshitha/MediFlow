// Gives any page the signed-in user and the sign-in / sign-out actions.

import { useContext } from "react";
import { AuthContext } from "./AuthSession";

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
};
