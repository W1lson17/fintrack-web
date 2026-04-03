import { api } from "@/shared/services/api"
import type {
  SavingGoal,
  CreateSavingGoalRequest,
  UpdateSavingGoalProgressRequest
} from "@/features/saving-goals/types/saving-goal.types"
import type { PaginatedResponse } from "@/shared/types/api.types"

/**
 * Saving Goal Service
 *
 * Handles all API calls for saving goal management.
 * Uses the centralized axios instance — interceptors handle token attachment.
 */

/**
 * Fetches a paginated list of saving goals for the authenticated user.
 * GET /saving-goals?page=&limit=
 */
export const getSavingGoalsService = async (params?: {
  page?: number
  limit?: number
}): Promise<PaginatedResponse<SavingGoal>> => {
  const response = await api.get<PaginatedResponse<SavingGoal>>("/saving-goals", { params })
  return response.data
}

/**
 * Creates a new saving goal.
 * POST /saving-goals
 */
export const createSavingGoalService = async (
  data: CreateSavingGoalRequest
): Promise<SavingGoal> => {
  const response = await api.post<SavingGoal>("/saving-goals", data)
  return response.data
}

/**
 * Updates the progress of a saving goal.
 * PATCH /saving-goals/:id
 * Adds amount to currentAmount — validated against targetAmount in API.
 */
export const updateSavingGoalProgressService = async (
  id: string,
  data: UpdateSavingGoalProgressRequest
): Promise<SavingGoal> => {
  const response = await api.patch<SavingGoal>(`/saving-goals/${id}`, data)
  return response.data
}

/**
 * Deletes a saving goal by ID.
 * DELETE /saving-goals/:id
 */
export const deleteSavingGoalService = async (id: string): Promise<void> => {
  await api.delete(`/saving-goals/${id}`)
}