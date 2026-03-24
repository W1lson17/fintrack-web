import { useQuery } from "@tanstack/react-query"
import { api } from "@/shared/services/api"
import type { PaginatedResponse } from "@/shared/types/api.types"
import type { TransactionType } from "@/shared/constants/transaction.constants"

interface Category {
  id: string
  name: string
  type: TransactionType
  userId: string
  createdAt: string
}

/**
 * useCategories hook (temporary — will be replaced in feature/categories)
 *
 * Fetches all categories for the authenticated user.
 * Used by TransactionsPage to populate the category select.
 */
export const useCategories = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["categories", "list", params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Category>>("/categories", { params })
      return response.data
    }
  })
}