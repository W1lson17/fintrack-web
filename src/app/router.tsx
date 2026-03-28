import { lazy, Suspense, type ReactNode } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { GuestGuard } from "@/features/auth/components/GuestGuard";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { AppLayout } from "@/shared/layouts/AppLayout";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { PageLoader } from "@/shared/components/PageLoader";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

/**
 * Lazy-loaded pages
 *
 * Each page is loaded on demand — reduces initial bundle size.
 * ErrorBoundary wraps each lazy import — handles chunk fetch failures gracefully.
 */
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);

const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);

const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);

const TransactionsPage = lazy(() =>
  import("@/features/transactions/pages/TransactionsPage").then((m) => ({
    default: m.TransactionsPage,
  })),
);

const CategoriesPage = lazy(() =>
  import("@/features/categories/pages/CategoriesPage").then((m) => ({
    default: m.CategoriesPage,
  })),
);

const SavingGoalsPage = lazy(() =>
  import("@/features/saving-goals/pages/SavingGoalsPage").then((m) => ({
    default: m.SavingGoalsPage,
  })),
);

const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  })),
);

/**
 * withSuspense helper
 *
 * Wraps a lazy-loaded page with ErrorBoundary + Suspense.
 * ErrorBoundary handles dynamic import failures.
 * PageLoader is shown while the chunk is being fetched.
 */
const withSuspense = (component: ReactNode) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>{component}</Suspense>
  </ErrorBoundary>
);

/**
 * Application router
 *
 * Route structure:
 * - "/" redirects to "/dashboard"
 * - GuestGuard + AuthLayout: public routes — login, register
 * - AuthGuard + AppLayout: protected routes — dashboard, transactions, etc.
 * - "*" catches all unmatched routes — renders NotFoundPage
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    // Public routes — accessible only when NOT authenticated
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: withSuspense(<LoginPage />),
          },
          {
            path: ROUTES.REGISTER,
            element: withSuspense(<RegisterPage />),
          },
        ],
      },
    ],
  },
  {
    // Protected routes — accessible only when authenticated
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: withSuspense(<DashboardPage />),
          },
          {
            path: ROUTES.TRANSACTIONS,
            element: withSuspense(<TransactionsPage />),
          },
          {
            path: ROUTES.CATEGORIES,
            element: withSuspense(<CategoriesPage />),
          },
          {
            path: ROUTES.SAVING_GOALS,
            element: withSuspense(<SavingGoalsPage />),
          },
          {
            path: ROUTES.PROFILE,
            element: withSuspense(<ProfilePage />),
          },
        ],
      },
    ],
  },
  {
    // Catch all unmatched routes
    path: "*",
    element: <NotFoundPage />,
  },
]);

/**
 * RouterProvider component
 * Wraps the app with the configured browser router.
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
