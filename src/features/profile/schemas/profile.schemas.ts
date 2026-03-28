import { z } from "zod"

/**
 * Profile Schemas
 *
 * Zod schemas for validating profile form inputs.
 * Aligned with the API validation rules from fintrack-api.
 */

/**
 * Schema for updating user name
 *
 * - name: required, min 1, max 255 characters
 */
export const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters")
})

/**
 * Schema for changing user password
 *
 * - currentPassword: required — verified against stored hash before updating
 * - newPassword:     min 8, max 32 characters, same strength rules as registration
 * - confirmPassword: must match newPassword — frontend only, not sent to API
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

/**
 * Schema for deleting user account
 *
 * - password: required — user must confirm their password before deletion
 */
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to delete your account")
})

/**
 * Inferred TypeScript types from the schemas above.
 */
export type UpdateNameFormValues = z.infer<typeof updateNameSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>