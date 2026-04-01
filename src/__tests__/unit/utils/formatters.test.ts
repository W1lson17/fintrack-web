/**
 * Shared Utils Unit Tests — formatters.ts
 *
 * Tests currency and date formatting utilities.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { describe, it, expect } from "vitest"
import { formatCurrency, formatDate } from "@/shared/utils/formatters"

describe("formatCurrency", () => {
  it("should format a positive number as MXN currency", () => {
    expect(formatCurrency(1500)).toContain("1,500.00")
  })

  it("should format zero as MXN currency", () => {
    expect(formatCurrency(0)).toContain("0.00")
  })

  it("should format a decimal number correctly", () => {
    expect(formatCurrency(1500.5)).toContain("1,500.50")
  })
})

describe("formatDate", () => {
  it("should format a Date object to readable string", () => {
    // Arrange
    const date = new Date("2026-03-21")

    // Act
    const result = formatDate(date)

    // Assert
    expect(result).toContain("2026")
    expect(result).toContain("21")
  })

  it("should format an ISO string to readable string", () => {
    // Act
    const result = formatDate("2026-03-21")

    // Assert
    expect(result).toContain("2026")
    expect(result).toContain("21")
  })
})