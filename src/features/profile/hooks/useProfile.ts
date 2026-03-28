import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  getProfileService,
  updateNameService,
  changePasswordService,
  deleteAccountService
} from "@/features/profile/services/profile.service"
import type { UpdateNameRequest, ChangePasswordRequest, DeleteAccountRequest } from "@/features/profile/types/profile.types"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { getErrorMessage } from "@/shared/utils/errors"
import { ROUTES } from "@/shared/constants/routes"

/**
 * Profile query key factory
 *
 * Centralizes query keys for profile — ensures correct cache
 * invalidation when mutations occur.
 */
export const profileKeys = {
  all: ["profile"] as const,
  detail: () => ["profile", "detail"] as const
}

/**
 * useProfile hook
 *
 * Fetches the authenticated user's profile.
 */
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getProfileService
  })
}

/**
 * useUpdateName hook
 *
 * Updates the authenticated user's name.
 * On success: invalidates profile cache and shows toast.
 * On error: shows toast with error message from API.
 */
export const useUpdateName = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateNameRequest) => updateNameService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
      toast.success("Name updated successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not update name. Please try again."))
    }
  })
}

/**
 * useChangePassword hook
 *
 * Changes the authenticated user's password.
 * On success: shows toast.
 * On error: shows toast with error message from API.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePasswordService(data),
    onSuccess: () => {
      toast.success("Password changed successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not change password. Please try again."))
    }
  })
}

/**
 * useDeleteAccount hook
 *
 * Deletes the authenticated user's account.
 * On success: clears auth tokens and redirects to login.
 * On error: shows toast with error message from API.
 */
export const useDeleteAccount = () => {
  const { clearTokens } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => deleteAccountService(data),
    onSuccess: () => {
      clearTokens()
      navigate(ROUTES.LOGIN)
      toast.success("Account deleted successfully")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete account. Please try again."))
    }
  })
}