/**
 * Auth Types
 *
 * TypeScript interfaces for authentication-related data.
 * Aligned with the API response shapes from fintrack-api.
 */

/**
 * Response returned by /auth/register and /auth/login
 */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

/**
 * Request body for /auth/register
 */
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

/**
 * Request body for /auth/login
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Request body for /auth/refresh
 */
export interface RefreshRequest {
  refreshToken: string
}

/**
 * Request body for /auth/logout
 */
export interface LogoutRequest {
  refreshToken: string
}