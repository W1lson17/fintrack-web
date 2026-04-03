import { z } from "zod"

/**
 * Auth Schemas
 *
 * Zod schemas for validating auth form inputs.
 * Aligned with the API validation rules from fintrack-api.
 */

/**
 * Schema for the login form
 *
 * - email: valid email format
 * - password: non-empty string
 */
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

/**
 * Schema for the register form
 *
 * - name:     required, non-empty string
 * - email:    valid email format
 * - password: min 8, max 32 characters
 *             must contain lowercase, uppercase, number and special character
 * - confirmPassword: must match password
 */
export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

/**
 * Schema for the forgot password form
 *
 * - email: valid email format — used to find the account and send reset link
 */
export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address")
})

/**
 * Schema for the reset password form
 *
 * - newPassword:     min 8, max 32 characters, same strength rules as registration
 * - confirmPassword: must match newPassword — validated client-side only
 */
export const resetPasswordSchema = z
  .object({
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
 * Inferred TypeScript types from the schemas above.
 */
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>