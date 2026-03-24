import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getTransactionsService,
  createTransactionService,
  deleteTransactionService
} from "@/features/transactions/services/transaction.service"
import type { CreateTransactionRequest, TransactionQueryParams } from "@/features/transactions/types/transaction.types"
import { getErrorMessage } from "@/shared/utils/errors"

/**
 * Transaction query key factory
 *
 * Centralizes query keys for transactions — ensures correct cache
 * invalidation when mutations occur.
 */
export const transactionKeys = {
  all: ["transactions"] as const,
  list: (params?: TransactionQueryParams) => ["transactions", "list", params] as const,
  detail: (id: string) => ["transactions", "detail", id] as const
}

/**
 * useTransactions hook
 *
 * Fetches a paginated list of transactions with optional filters.
 * Cache key includes params — refetches when filters or page changes.
 */
export const useTransactions = (params?: TransactionQueryParams) => {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => getTransactionsService(params)
  })
}

/**
 * useCreateTransaction hook
 *
 * Creates a new transaction.
 * On success: invalidates transactions cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => createTransactionService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      toast.success("Transaction created successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create transaction. Please try again."))
    }
  })
}

/**
 * useDeleteTransaction hook
 *
 * Deletes a transaction by ID.
 * On success: invalidates transactions cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransactionService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      toast.success("Transaction deleted successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete transaction. Please try again."))
    }
  })
}