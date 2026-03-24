import type { TransactionType } from "@/shared/constants/transaction.constants"

/**
 * Transaction Types
 *
 * TypeScript interfaces for transaction-related data.
 * Aligned with the API response shapes from fintrack-api.
 */

export type { TransactionType }

/**
 * Category embedded in transaction response
 */
export interface TransactionCategory {
  id: string
  name: string
  type: TransactionType
  userId: string
  createdAt: string
}

/**
 * Full transaction object returned by the API
 */
export interface Transaction {
  id: string
  amount: number
  description: string | null
  type: TransactionType
  date: string
  categoryId: string
  userId: string
  createdAt: string
  category: TransactionCategory
}

/**
 * Request body for POST /transactions
 */
export interface CreateTransactionRequest {
  amount: number
  type: TransactionType
  categoryId: string
  description?: string
  date?: Date | undefined
}

/**
 * Query parameters for GET /transactions
 */
export interface TransactionQueryParams {
  type?: TransactionType
  categoryId?: string
  page?: number
  limit?: number
}