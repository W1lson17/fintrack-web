/**
 * Dashboard Types
 *
 * TypeScript interfaces for dashboard-related data.
 * Aligned with the API response shapes from fintrack-api.
 */

/**
 * Response from GET /reports/summary
 */
export interface MonthlySummary {
  month: number
  year: number
  totalIncome: number
  totalExpenses: number
  balance: number
}

/**
 * Single category spending entry.
 * Response from GET /reports/categories
 */
export interface CategorySpending {
  categoryName: string
  total: number
}