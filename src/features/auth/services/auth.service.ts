import { api } from "@/shared/services/api"
import type { AuthResponse, LoginRequest, RegisterRequest, LogoutRequest, ForgotPasswordRequest, ResetPasswordRequest } from "@/features/auth/types/auth.types"

/**
 * Auth Service
 *
 * Handles all API calls for authentication.
 * Uses the centralized axios instance — interceptors handle token attachment.
 */

/**
 * Registers a new user account.
 * Returns accessToken and refreshToken on success.
 */
export const registerService = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data)
  return response.data
}

/**
 * Authenticates a user with email and password.
 * Returns accessToken and refreshToken on success.
 */
export const loginService = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data)
  return response.data
}

/**
 * Invalidates the current refresh token — ends the session.
 * Called on logout before clearing the auth store.
 */
export const logoutService = async (data: LogoutRequest): Promise<void> => {
  await api.post("/auth/logout", data)
}

/**
 * Sends a password reset email to the provided address.
 * Always resolves — API returns 204 regardless of email existence.
 */
export const forgotPasswordService = async (data: ForgotPasswordRequest): Promise<void> => {
  await api.post("/auth/forgot-password", data)
}

/**
 * Resets the user's password using a valid reset token.
 * Token is extracted from the URL query params and passed here.
 */
export const resetPasswordService = async (data: ResetPasswordRequest): Promise<void> => {
  await api.post("/auth/reset-password", data)
}