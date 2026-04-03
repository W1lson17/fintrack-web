import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getSavingGoalsService,
  createSavingGoalService,
  updateSavingGoalProgressService,
  deleteSavingGoalService
} from "@/features/saving-goals/services/saving-goal.service"
import type {
  CreateSavingGoalRequest,
  UpdateSavingGoalProgressRequest
} from "@/features/saving-goals/types/saving-goal.types"
import { getErrorMessage } from "@/shared/utils/errors"

/**
 * Saving Goal query key factory
 *
 * Centralizes query keys for saving goals — ensures correct cache
 * invalidation when mutations occur.
 */
export const savingGoalKeys = {
  all: ["saving-goals"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    ["saving-goals", "list", params] as const
}

/**
 * useSavingGoals hook
 *
 * Fetches a paginated list of saving goals.
 * Cache key includes params — refetches when page or limit changes.
 */
export const useSavingGoals = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: savingGoalKeys.list(params),
    queryFn: () => getSavingGoalsService(params)
  })
}

/**
 * useCreateSavingGoal hook
 *
 * Creates a new saving goal.
 * On success: invalidates saving goals cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useCreateSavingGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSavingGoalRequest) => createSavingGoalService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingGoalKeys.all })
      toast.success("Saving goal created successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create saving goal. Please try again."))
    }
  })
}

/**
 * useUpdateSavingGoalProgress hook
 *
 * Updates the progress of a saving goal.
 * On success: invalidates saving goals cache and shows toast.
 * On error: shows toast with error message from API — includes AMOUNT_EXCEEDS_TARGET.
 */
export const useUpdateSavingGoalProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSavingGoalProgressRequest }) =>
      updateSavingGoalProgressService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingGoalKeys.all })
      toast.success("Progress updated successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not update progress. Please try again."))
    }
  })
}

/**
 * useDeleteSavingGoal hook
 *
 * Deletes a saving goal by ID.
 * On success: invalidates saving goals cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useDeleteSavingGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSavingGoalService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingGoalKeys.all })
      toast.success("Saving goal deleted successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete saving goal. Please try again."))
    }
  })
}