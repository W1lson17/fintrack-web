import axios from "axios"

/**
 * Extracts a readable error message from an axios error response.
 * Handles specific HTTP status codes with user-friendly messages.
 * Falls back to the API message or a generic fallback string.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Too many attempts. Please wait a moment and try again."
    }
    return error.response?.data?.message ?? fallback
  }
  // Handles errors thrown directly (e.g. rate limit converted to Error in interceptor)
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}