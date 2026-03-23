import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { loginService, registerService, logoutService } from "@/features/auth/services/auth.service"
import { ROUTES } from "@/shared/constants/routes"
import type { LoginRequest, RegisterRequest } from "@/features/auth/types/auth.types"

/**
 * Extracts a readable error message from an axios error response.
 * Handles specific HTTP status codes with user-friendly messages.
 * Falls back to the API message or a generic fallback string.
 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Too many attempts. Please wait a moment and try again."
    }
    return error.response?.data?.message ?? fallback
  }
  // Handles errors thrown directly (e.g. rate limit converted to Error in interceptor)
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

/**
 * useLogin hook
 *
 * Handles login form submission.
 * On success: stores tokens and redirects to dashboard.
 * On error: shows toast with error message from API.
 */
export const useLogin = () => {
  const { setTokens } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => loginService(data),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
      toast.success("Welcome back!")
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Invalid email or password"))
    }
  })
}

/**
 * useRegister hook
 *
 * Handles register form submission.
 * On success: stores tokens and redirects to dashboard.
 * On error: shows toast with error message from API.
 */
export const useRegister = () => {
  const { setTokens } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerService(data),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
      toast.success("Account created successfully!")
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create account. Please try again."))
    }
  })
}

/**
 * useLogout hook
 *
 * Handles logout action.
 * Calls the API to invalidate the refresh token,
 * then clears the auth store and redirects to login.
 */
export const useLogout = () => {
  const { refreshToken, clearTokens } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => logoutService({ refreshToken: refreshToken! }),
    onSuccess: () => {
      clearTokens()
      navigate(ROUTES.LOGIN)
      toast.success("Logged out successfully")
    },
    onError: () => {
      // Clear tokens even if API call fails
      clearTokens()
      navigate(ROUTES.LOGIN)
    }
  })
}