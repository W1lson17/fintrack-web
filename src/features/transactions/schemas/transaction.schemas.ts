import { z } from "zod"
import { TRANSACTION_TYPES } from "@/shared/constants/transaction.constants"

/**
 * Transaction Schemas
 *
 * Zod schemas for validating transaction form inputs.
 * Aligned with the API validation rules from fintrack-api.
 */

/**
 * Schema for creating a new transaction
 *
 * - amount:      required positive number
 * - type:        INCOME or EXPENSE — enforced via shared constants
 * - categoryId:  required UUID
 * - description: optional string, max 255 characters
 * - date:        optional date, defaults to today
 */
export const createTransactionSchema = z.object({
  amount: z.coerce
    .number<number>("Amount must be a number")
    .positive("Amount must be greater than 0"),
  type: z.enum(TRANSACTION_TYPES, {
    message: "Type must be INCOME or EXPENSE"
  }),
  categoryId: z.uuid("Please select a valid category"),
  description: z.string().max(255, "Description must be less than 255 characters").optional(),
  date: z.coerce.date<Date | undefined>().optional()
})

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>