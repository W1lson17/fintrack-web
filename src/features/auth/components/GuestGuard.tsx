import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ROUTES } from "@/shared/constants/routes";

/**
 * GuestGuard component
 *
 * Protects public routes (login, register) from authenticated users.
 * Redirects to dashboard if the user is already authenticated.
 * Renders child routes via <Outlet /> if not authenticated.
 */
export const GuestGuard = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
