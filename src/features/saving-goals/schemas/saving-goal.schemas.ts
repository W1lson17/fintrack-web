import { z } from "zod"

/**
 * Saving Goal Schemas
 *
 * Zod schemas for validating saving goal form inputs.
 * Aligned with the API validation rules from fintrack-api.
 */

/**
 * Schema for creating a new saving goal
 *
 * - name:         required, min 1, max 255 characters
 * - targetAmount: required positive number
 * - deadline:     optional future date — refine ensures date is strictly in the future
 */
export const createSavingGoalSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  targetAmount: z.coerce
    .number<number>("Target amount must be a number")
    .positive("Target amount must be greater than 0"),
  deadline: z.coerce
    .date<Date | undefined>()
    .refine((d) => d > new Date(), "Deadline must be in the future")
    .optional()
})

/**
 * Schema for updating saving goal progress
 *
 * - amount: required positive number — added to currentAmount
 *           API validates that currentAmount + amount <= targetAmount
 */
export const updateSavingGoalProgressSchema = z.object({
  amount: z.coerce
    .number<number>("Amount must be a number")
    .positive("Amount must be greater than 0")
})

export type CreateSavingGoalFormValues = z.infer<typeof createSavingGoalSchema>
export type UpdateSavingGoalProgressFormValues = z.infer<typeof updateSavingGoalProgressSchema>