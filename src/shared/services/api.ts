import axios from "axios"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { ROUTES } from "@/shared/constants/routes"

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined. Check your .env file.")
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

/**
 * Auth routes that should never trigger token refresh.
 * 401 on these routes means invalid credentials — not expired token.
 */
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"]

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
 * 1. Skips refresh logic for auth routes — 401 on login/register means wrong credentials
 * 2. Attempts to refresh the accessToken using the refreshToken
 * 3. If successful — retries the original request with the new accessToken
 * 4. If refresh fails — clears auth state and redirects to login
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

    // Skip refresh logic for auth routes
    const isAuthRoute = AUTH_ROUTES.some(route =>
      originalRequest?.url?.includes(route)
    )

    if (isAuthRoute) {
      return Promise.reject(error)
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

        setTokens(newAccessToken, newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        clearTokens()
        window.location.href = ROUTES.LOGIN
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)