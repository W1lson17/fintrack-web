/**
 * Shared Utils Unit Tests — errors.ts
 *
 * Tests error message extraction from axios errors and generic errors.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { describe, it, expect } from "vitest"
import axios, { type InternalAxiosRequestConfig } from "axios"
import { getErrorMessage } from "@/shared/utils/errors"

describe("getErrorMessage", () => {
  const fallback = "Something went wrong"

  it("should return rate limit message for 429 status", () => {
    // Arrange
    const error = new axios.AxiosError("Too many requests")
    error.response = { status: 429, data: {}, headers: {}, config: {} as InternalAxiosRequestConfig, statusText: "" }

    // Act
    const result = getErrorMessage(error, fallback)

    // Assert
    expect(result).toBe("Too many attempts. Please wait a moment and try again.")
  })

  it("should return API message from response data", () => {
    // Arrange
    const error = new axios.AxiosError("Bad request")
    error.response = { status: 400, data: { message: "Invalid email" }, headers: {}, config: {} as InternalAxiosRequestConfig, statusText: "" }

    // Act
    const result = getErrorMessage(error, fallback)

    // Assert
    expect(result).toBe("Invalid email")
  })

  it("should return fallback if no API message in response", () => {
    // Arrange
    const error = new axios.AxiosError("Bad request")
    error.response = { status: 400, data: {}, headers: {}, config: {} as InternalAxiosRequestConfig, statusText: "" }

    // Act
    const result = getErrorMessage(error, fallback)

    // Assert
    expect(result).toBe(fallback)
  })

  it("should return error message for generic Error", () => {
    // Arrange
    const error = new Error("Network failure")

    // Act
    const result = getErrorMessage(error, fallback)

    // Assert
    expect(result).toBe("Network failure")
  })

  it("should return fallback for unknown error type", () => {
    // Arrange
    const error = "unexpected string error"

    // Act
    const result = getErrorMessage(error, fallback)

    // Assert
    expect(result).toBe(fallback)
  })
})