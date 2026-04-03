// src/features/dashboard/services/dashboard.service.ts

import { api } from "@/shared/services/api"
import type { MonthlySummary, CategorySpending } from "@/features/dashboard/types/dashboard.types"
import type { ReportParams } from "@/shared/types/api.types"

/**
 * Dashboard Service
 *
 * Handles all API calls for dashboard data.
 * Uses the centralized axios instance — interceptors handle token attachment.
 */

/**
 * Fetches the monthly income/expense summary.
 * GET /reports/summary?month=&year=
 */
export const getMonthlySummaryService = async (params: ReportParams): Promise<MonthlySummary> => {
  const response = await api.get<MonthlySummary>("/reports/summary", { params })
  return response.data
}

/**
 * Fetches the spending breakdown by category.
 * GET /reports/categories?month=&year=
 */
export const getCategorySpendingService = async (params: ReportParams): Promise<CategorySpending[]> => {
  const response = await api.get<CategorySpending[]>("/reports/categories", { params })
  return response.data
}