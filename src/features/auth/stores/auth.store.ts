import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Auth Store
 *
 * Global authentication state managed by Zustand.
 * Persisted to localStorage — survives page refreshes.
 *
 * Stores:
 * - accessToken: short-lived JWT (15m) used in Authorization headers
 * - refreshToken: long-lived UUID (7d) used to rotate tokens
 * - isAuthenticated: derived from accessToken presence
 */

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      /**
       * Stores tokens after successful login or register.
       * Sets isAuthenticated to true.
       */
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      /**
       * Clears all auth state.
       * Called on logout or when refresh token is invalid.
       */
      clearTokens: () =>
        set({ accessToken: null, refreshToken: null, isAuthenticated: false })
    }),
    {
      name: "fintrack-auth", // localStorage key
      // Only persist tokens — actions are excluded automatically
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
)