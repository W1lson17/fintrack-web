import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ROUTES } from "@/shared/constants/routes";

/**
 * AuthGuard component
 *
 * Protects routes that require authentication.
 * Redirects to login if the user is not authenticated.
 * Renders child routes via <Outlet /> if authenticated.
 */
export const AuthGuard = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
