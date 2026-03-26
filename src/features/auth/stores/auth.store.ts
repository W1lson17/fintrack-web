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
 *
 * isAuthenticated is derived from accessToken presence — not stored separately.
 * This prevents the bug where isAuthenticated resets to false on page refresh
 * while tokens are still valid in localStorage.
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
       * Derives isAuthenticated from accessToken presence.
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
      name: "fintrack-auth",
      // Persist tokens and derive isAuthenticated on rehydration
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: !!state.accessToken
      })
    }
  )
)