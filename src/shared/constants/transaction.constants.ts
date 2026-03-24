/**
 * Transaction type constants
 *
 * Centralized to avoid duplicating strings across schemas and components.
 */
export const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const
export type TransactionType = typeof TRANSACTION_TYPES[number]