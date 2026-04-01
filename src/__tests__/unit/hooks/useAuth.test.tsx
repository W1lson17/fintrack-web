/**
 * useAuth Hook Unit Tests
 *
 * Tests authentication hooks in isolation.
 * API calls are mocked — no real HTTP requests are made.
 * Navigation is mocked — no real routing occurs.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
} from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/stores/auth.store";

// Mock auth service — no real API calls
vi.mock("@/features/auth/services/auth.service", () => ({
  loginService: vi.fn(),
  registerService: vi.fn(),
  logoutService: vi.fn(),
  forgotPasswordService: vi.fn(),
  resetPasswordService: vi.fn(),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  loginService,
  registerService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
} from "@/features/auth/services/auth.service";
import { toast } from "sonner";

/**
 * Creates a fresh QueryClient for each test — prevents cache bleeding between tests.
 */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearTokens();
  });

  it("should store tokens and navigate to dashboard on success", async () => {
    // Arrange
    vi.mocked(loginService).mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    // Act
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ email: "test@test.com", password: "Test1234!" });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().accessToken).toBe("access-token");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(loginService).mockRejectedValue(new Error("Invalid credentials"));

    // Act
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ email: "test@test.com", password: "wrong" });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearTokens();
  });

  it("should store tokens and navigate to dashboard on success", async () => {
    // Arrange
    vi.mocked(registerService).mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    // Act
    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        name: "Test User",
        email: "test@test.com",
        password: "Test1234!",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().accessToken).toBe("access-token");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(registerService).mockRejectedValue(
      new Error("Email already exists"),
    );

    // Act
    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        name: "Test User",
        email: "existing@test.com",
        password: "Test1234!",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().setTokens("access-token", "refresh-token");
  });

  it("should clear tokens and navigate to login on success", async () => {
    // Arrange
    vi.mocked(logoutService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate();
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should clear tokens and navigate to login even if API fails", async () => {
    // Arrange
    vi.mocked(logoutService).mockRejectedValue(new Error("Network error"));

    // Act
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate();
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

describe("useForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(forgotPasswordService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ email: "test@test.com" });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(forgotPasswordService).mockRejectedValue(
      new Error("Network error"),
    );

    // Act
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ email: "test@test.com" });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast and navigate to login on success", async () => {
    // Arrange
    vi.mocked(resetPasswordService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ token: "valid-token", newPassword: "NewPass1!" });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(resetPasswordService).mockRejectedValue(
      new Error("Token expired"),
    );

    // Act
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        token: "expired-token",
        newPassword: "NewPass1!",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});
