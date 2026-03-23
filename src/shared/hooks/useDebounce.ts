import { useState, useEffect } from "react"

/**
 * useDebounce hook
 *
 * Delays updating a value until the user stops changing it.
 * Useful for preventing excessive API calls on rapid input changes.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}