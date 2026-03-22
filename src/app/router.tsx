import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

/**
 * Lazy-loaded pages
 *
 * Each page is loaded on demand — reduces initial bundle size.
 * Suspense handles the loading state while the chunk is being fetched.
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

/**
 * Application router
 *
 * - "/" redirects to "/dashboard" by default
 * - All pages are wrapped in Suspense for lazy loading support
 * - Auth routes are public — protected routes will be added with AuthGuard
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.TRANSACTIONS,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionsPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.CATEGORIES,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SAVING_GOALS,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SavingGoalsPage />
      </Suspense>
    ),
  },
]);

/**
 * RouterProvider component
 * Wraps the app with the configured browser router.
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
