import { api } from "@/shared/services/api"
import type { Transaction, CreateTransactionRequest, TransactionQueryParams } from "@/features/transactions/types/transaction.types"
import type { PaginatedResponse } from "@/shared/types/api.types"

/**
 * Transaction Service
 *
 * Handles all API calls for transaction management.
 * Uses the centralized axios instance — interceptors handle token attachment.
 */

/**
 * Fetches a paginated list of transactions with optional filters.
 * GET /transactions?type=&categoryId=&page=&limit=
 */
export const getTransactionsService = async (
  params?: TransactionQueryParams
): Promise<PaginatedResponse<Transaction>> => {
  const response = await api.get<PaginatedResponse<Transaction>>("/transactions", { params })
  return response.data
}

/**
 * Fetches a single transaction by ID.
 * GET /transactions/:id
 */
export const getTransactionByIdService = async (id: string): Promise<Transaction> => {
  const response = await api.get<Transaction>(`/transactions/${id}`)
  return response.data
}

/**
 * Creates a new transaction.
 * POST /transactions
 */
export const createTransactionService = async (
  data: CreateTransactionRequest
): Promise<Transaction> => {
  const response = await api.post<Transaction>("/transactions", data)
  return response.data
}

/**
 * Deletes a transaction by ID.
 * DELETE /transactions/:id
 */
export const deleteTransactionService = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`)
}