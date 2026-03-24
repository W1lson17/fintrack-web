import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getCategoriesService,
  createCategoryService,
  deleteCategoryService
} from "@/features/categories/services/category.service"
import type { CreateCategoryRequest } from "@/features/categories/types/category.types"
import { getErrorMessage } from "@/shared/utils/errors"

/**
 * Category query key factory
 *
 * Centralizes query keys for categories — ensures correct cache
 * invalidation when mutations occur.
 */
export const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    ["categories", "list", params] as const
}

/**
 * useCategories hook
 *
 * Fetches a paginated list of categories.
 * Cache key includes params — refetches when page or limit changes.
 */
export const useCategories = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategoriesService(params)
  })
}

/**
 * useCreateCategory hook
 *
 * Creates a new category.
 * On success: invalidates categories cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategoryService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Category created successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create category. Please try again."))
    }
  })
}

/**
 * useDeleteCategory hook
 *
 * Deletes a category by ID.
 * On success: invalidates categories cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategoryService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Category deleted successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete category. Please try again."))
    }
  })
}