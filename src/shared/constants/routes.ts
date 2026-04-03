/**
 * Application route constants
 *
 * Centralized route definitions to avoid hardcoded strings throughout the app.
 * Always import from here instead of writing route strings directly.
 */
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // App
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  CATEGORIES: "/categories",
  SAVING_GOALS: "/saving-goals",
  PROFILE: "/profile",

  // Forgot password
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const