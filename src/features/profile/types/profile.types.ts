/**
 * Profile Types
 *
 * TypeScript interfaces for user profile-related data.
 * Aligned with the API response shapes from fintrack-api.
 */

/**
 * Full user profile object returned by the API
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: Date
}

/**
 * Request body for PATCH /users/me/name
 */
export interface UpdateNameRequest {
  name: string
}

/**
 * Request body for PATCH /users/me/password
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Request body for DELETE /users/me
 */
export interface DeleteAccountRequest {
  password: string
}