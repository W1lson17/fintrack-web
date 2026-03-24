import { api } from "@/shared/services/api"
import type { Category, CreateCategoryRequest } from "@/features/categories/types/category.types"
import type { PaginatedResponse } from "@/shared/types/api.types"

/**
 * Category Service
 *
 * Handles all API calls for category management.
 * Uses the centralized axios instance — interceptors handle token attachment.
 */

/**
 * Fetches a paginated list of categories for the authenticated user.
 * GET /categories?page=&limit=
 */
export const getCategoriesService = async (params?: {
  page?: number
  limit?: number
}): Promise<PaginatedResponse<Category>> => {
  const response = await api.get<PaginatedResponse<Category>>("/categories", { params })
  return response.data
}

/**
 * Creates a new category.
 * POST /categories
 */
export const createCategoryService = async (
  data: CreateCategoryRequest
): Promise<Category> => {
  const response = await api.post<Category>("/categories", data)
  return response.data
}

/**
 * Deletes a category by ID.
 * DELETE /categories/:id
 */
export const deleteCategoryService = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`)
}