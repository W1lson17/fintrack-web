import { useQuery } from "@tanstack/react-query"
import { getMonthlySummaryService, getCategorySpendingService } from "@/features/dashboard/services/dashboard.service"
import type { ReportParams } from "@/shared/types/api.types"

/**
 * Dashboard Hooks
 *
 * Custom hooks for fetching dashboard data using TanStack Query.
 * Each hook manages its own cache key — data is refetched when params change.
 */

/**
 * useMonthlySummary hook
 *
 * Fetches the monthly income/expense summary.
 * Cache key includes month and year — refetches when either changes.
 */
export const useMonthlySummary = (params: ReportParams) => {
  return useQuery({
    queryKey: ["reports", "summary", params.month, params.year],
    queryFn: () => getMonthlySummaryService(params)
  })
}

/**
 * useCategorySpending hook
 *
 * Fetches the spending breakdown by category.
 * Cache key includes month and year — refetches when either changes.
 */
export const useCategorySpending = (params: ReportParams) => {
  return useQuery({
    queryKey: ["reports", "categories", params.month, params.year],
    queryFn: () => getCategorySpendingService(params)
  })
}