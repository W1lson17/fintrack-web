import type { TransactionType } from "@/shared/constants/transaction.constants"

/**
 * Category Types
 *
 * TypeScript interfaces for category-related data.
 * Aligned with the API response shapes from fintrack-api.
 */

/**
 * Full category object returned by the API
 */
export interface Category {
  id: string
  name: string
  type: TransactionType
  userId: string
  createdAt: Date
}

/**
 * Request body for POST /categories
 */
export interface CreateCategoryRequest {
  name: string
  type: TransactionType
}