/**
 * Shared API Types
 *
 * Common TypeScript interfaces used across all features.
 * Aligned with fintrack-api response shapes.
 */

/**
 * Standard paginated response wrapper.
 * Used by categories, transactions and saving-goals list endpoints.
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

/**
 * Standard API error response shape.
 */
export interface ApiError {
  code: string
  message: string
  statusCode: number
}

/**
 * Query parameters for monthly report endpoints.
 * Used by GET /reports/summary and GET /reports/categories.
 */
export interface ReportParams {
  month: number
  year: number
}