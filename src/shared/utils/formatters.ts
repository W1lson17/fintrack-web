/**
 * Shared Formatters
 *
 * Utility functions for formatting data across the application.
 */

/**
 * Formats a number as currency (MXN).
 * Uses Intl.NumberFormat for locale-aware formatting.
 *
 * @example formatCurrency(1500) → "$ 1,500.00"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  }).format(amount)
}

/**
 * Formats a Date object or ISO string to a readable date string.
 *
 * @example formatDate("2026-03-21") → "21 mar 2026"
 */
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date))
}