import axios from "axios"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { ROUTES } from "@/shared/constants/routes"

/**
 * Validate required environment variables at startup.
 * Throws immediately if VITE_API_URL is not defined — prevents silent failures
 * in production where a missing env var would cause all requests to fail.
 */
const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined. Check your .env file.")
}

/**
 * Axios API client
 *
 * Centralized axios instance for all API requests.
 * Base URL is read from VITE_API_URL environment variable.
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

/**
 * Request interceptor
 *
 * Automatically attaches the accessToken to every request
 * via the Authorization header.
 */
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

/**
 * Response interceptor
 *
 * Handles 401 Unauthorized responses:
 * 1. Attempts to refresh the accessToken using the refreshToken
 * 2. If successful — retries the original request with the new accessToken
 * 3. If refresh fails — clears auth state and redirects to login
 *
 * Handles 429 Too Many Requests:
 * - Returns a clear error message without retrying
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle rate limiting
    if (error.response?.status === 429) {
      return Promise.reject(
        new Error("Too many requests. Please wait a moment and try again.")
      )
    }

    // Handle 401 — attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { refreshToken, setTokens, clearTokens } = useAuthStore.getState()

      if (!refreshToken) {
        clearTokens()
        window.location.href = ROUTES.LOGIN
        return Promise.reject(error)
      }

      try {
        // Attempt to rotate tokens using a plain axios call
        // — avoids triggering this interceptor again
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        })

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data

        // Store new tokens
        setTokens(newAccessToken, newRefreshToken)

        // Retry original request with new accessToken
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        // Refresh failed — clear auth state and redirect to login
        clearTokens()
        window.location.href = ROUTES.LOGIN
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)