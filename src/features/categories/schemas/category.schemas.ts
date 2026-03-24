import { z } from "zod"
import { TRANSACTION_TYPES } from "@/shared/constants/transaction.constants"

/**
 * Category Schemas
 *
 * Zod schemas for validating category form inputs.
 * Aligned with the API validation rules from fintrack-api.
 */

/**
 * Schema for creating a new category
 *
 * - name: required, min 1, max 255 characters
 * - type: INCOME or EXPENSE — enforced via shared constants
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  type: z.enum(TRANSACTION_TYPES, {
    message: "Type must be INCOME or EXPENSE"
  })
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>