/**
 * Saving Goal Types
 *
 * TypeScript interfaces for saving-goal-related data.
 * Aligned with the API response shapes from fintrack-api.
 */

/**
 * Full saving goal object returned by the API
 */
export interface SavingGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date | null
  userId: string
  createdAt: Date
}

/**
 * Request body for POST /saving-goals
 */
export interface CreateSavingGoalRequest {
  name: string
  targetAmount: number
  deadline?: Date
}

/**
 * Request body for PATCH /saving-goals/:id
 */
export interface UpdateSavingGoalProgressRequest {
  amount: number
}