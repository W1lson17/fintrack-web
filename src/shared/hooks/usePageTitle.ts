import { useLocation } from "react-router-dom"
import { ROUTES } from "@/shared/constants/routes"

/**
 * Page title mapping
 *
 * Maps route paths to human-readable page titles.
 * Used by the navbar breadcrumb.
 */
const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.TRANSACTIONS]: "Transactions",
  [ROUTES.CATEGORIES]: "Categories",
  [ROUTES.SAVING_GOALS]: "Saving Goals"
}

/**
 * usePageTitle hook
 *
 * Returns the human-readable title for the current route.
 * Falls back to empty string for unknown routes.
 */
export const usePageTitle = (): string => {
  const { pathname } = useLocation()
  return PAGE_TITLES[pathname] ?? ""
}