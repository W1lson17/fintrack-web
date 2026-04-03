/**
 * useProfile Hook Unit Tests
 *
 * Tests profile hooks in isolation.
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
  useProfile,
  useUpdateName,
  useChangePassword,
  useDeleteAccount,
} from "@/features/profile/hooks/useProfile";
import { useAuthStore } from "@/features/auth/stores/auth.store";

// Mock profile service — no real API calls
vi.mock("@/features/profile/services/profile.service", () => ({
  getProfileService: vi.fn(),
  updateNameService: vi.fn(),
  changePasswordService: vi.fn(),
  deleteAccountService: vi.fn(),
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
  getProfileService,
  updateNameService,
  changePasswordService,
  deleteAccountService,
} from "@/features/profile/services/profile.service";
import { toast } from "sonner";

const mockProfile = {
  id: "user-123",
  name: "Test User",
  email: "test@test.com",
  createdAt: new Date(),
};

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

describe("useProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user profile on success", async () => {
    // Arrange
    vi.mocked(getProfileService).mockResolvedValue(mockProfile);

    // Act
    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
  });

  it("should return error state on failure", async () => {
    // Arrange
    vi.mocked(getProfileService).mockRejectedValue(new Error("Unauthorized"));

    // Act
    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(updateNameService).mockResolvedValue(mockProfile);

    // Act
    const { result } = renderHook(() => useUpdateName(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ name: "New Name" });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Name updated successfully");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(updateNameService).mockRejectedValue(new Error("Network error"));

    // Act
    const { result } = renderHook(() => useUpdateName(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ name: "New Name" });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useChangePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(changePasswordService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        currentPassword: "OldPass1!",
        newPassword: "NewPass1!",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Password changed successfully");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(changePasswordService).mockRejectedValue(
      new Error("Invalid password"),
    );

    // Act
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        currentPassword: "WrongPass1!",
        newPassword: "NewPass1!",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useDeleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().setTokens("access-token", "refresh-token");
  });

  it("should clear tokens and navigate to login on success", async () => {
    // Arrange
    vi.mocked(deleteAccountService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useDeleteAccount(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ password: "Test1234!" });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(toast.success).toHaveBeenCalledWith("Account deleted successfully");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(deleteAccountService).mockRejectedValue(
      new Error("Invalid password"),
    );

    // Act
    const { result } = renderHook(() => useDeleteAccount(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ password: "WrongPass1!" });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBe("access-token");
  });
});
