import { api } from "@/shared/services/api"
import type { UserProfile, UpdateNameRequest, ChangePasswordRequest, DeleteAccountRequest } from "@/features/profile/types/profile.types"

/**
 * Profile Service
 *
 * Handles all API calls for user profile management.
 * Uses the centralized axios instance — interceptors handle token attachment.
 */

/**
 * Fetches the authenticated user's profile.
 * GET /users/me
 */
export const getProfileService = async (): Promise<UserProfile> => {
  const response = await api.get<{ data: UserProfile }>("/users/me")
  return response.data.data
}

/**
 * Updates the authenticated user's name.
 * PATCH /users/me/name
 */
export const updateNameService = async (data: UpdateNameRequest): Promise<UserProfile> => {
  const response = await api.patch<{ data: UserProfile }>("/users/me/name", data)
  return response.data.data
}

/**
 * Changes the authenticated user's password.
 * PATCH /users/me/password
 */
export const changePasswordService = async (data: ChangePasswordRequest): Promise<void> => {
  await api.patch("/users/me/password", data)
}

/**
 * Deletes the authenticated user's account.
 * DELETE /users/me
 */
export const deleteAccountService = async (data: DeleteAccountRequest): Promise<void> => {
  await api.delete("/users/me", { data })
}