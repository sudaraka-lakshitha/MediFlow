// Only lets signed-in users with the right role open a page; others go to the sign-in page.

import { Navigate, Outlet } from "react-router-dom";
import { type Role } from "../auth/AuthSession";
import { useAuth } from "../auth/useAuth";

export function ProtectedRoute({
  roles,
  requireCashierAccess = false,
}: {
  roles?: Role[];
  requireCashierAccess?: boolean;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  if (
    requireCashierAccess &&
    !(
      user.role === "ADMIN" ||
      user.role === "CASHIER" ||
      (user.role === "PHARMACIST" && user.cashierAccess)
    )
  )
    return <Navigate to="/" replace />;
  return <Outlet />;
}
