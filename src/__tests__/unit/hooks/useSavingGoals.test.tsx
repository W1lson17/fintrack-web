/**
 * useSavingGoals Hook Unit Tests
 *
 * Tests saving goal hooks in isolation.
 * API calls are mocked — no real HTTP requests are made.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import {
  useSavingGoals,
  useCreateSavingGoal,
  useUpdateSavingGoalProgress,
  useDeleteSavingGoal,
} from "@/features/saving-goals/hooks/useSavingGoals";

// Mock saving goal service — no real API calls
vi.mock("@/features/saving-goals/services/saving-goal.service", () => ({
  getSavingGoalsService: vi.fn(),
  createSavingGoalService: vi.fn(),
  updateSavingGoalProgressService: vi.fn(),
  deleteSavingGoalService: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  getSavingGoalsService,
  createSavingGoalService,
  updateSavingGoalProgressService,
  deleteSavingGoalService,
} from "@/features/saving-goals/services/saving-goal.service";
import { toast } from "sonner";

const mockSavingGoal = {
  id: "saving-goal-123",
  name: "Vacation",
  targetAmount: 10000,
  currentAmount: 2500,
  deadline: new Date("2027-12-31T12:00:00.000Z"),
  userId: "user-123",
  createdAt: new Date("2026-01-01T12:00:00.000Z"),
};

const mockPaginatedResponse = {
  data: [mockSavingGoal],
  meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
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

describe("useSavingGoals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated saving goals on success", async () => {
    // Arrange
    vi.mocked(getSavingGoalsService).mockResolvedValue(mockPaginatedResponse);

    // Act
    const { result } = renderHook(() => useSavingGoals(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPaginatedResponse);
    expect(getSavingGoalsService).toHaveBeenCalledWith(undefined);
  });

  it("should pass pagination params to service", async () => {
    // Arrange
    vi.mocked(getSavingGoalsService).mockResolvedValue(mockPaginatedResponse);

    // Act
    const { result } = renderHook(() => useSavingGoals({ page: 2, limit: 5 }), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getSavingGoalsService).toHaveBeenCalledWith({ page: 2, limit: 5 });
  });

  it("should return error state on failure", async () => {
    // Arrange
    vi.mocked(getSavingGoalsService).mockRejectedValue(
      new Error("Unauthorized"),
    );

    // Act
    const { result } = renderHook(() => useSavingGoals(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateSavingGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(createSavingGoalService).mockResolvedValue(mockSavingGoal);

    // Act
    const { result } = renderHook(() => useCreateSavingGoal(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ name: "Vacation", targetAmount: 10000 });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Saving goal created successfully",
    );
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(createSavingGoalService).mockRejectedValue(
      new Error("Network error"),
    );

    // Act
    const { result } = renderHook(() => useCreateSavingGoal(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ name: "Vacation", targetAmount: 10000 });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useUpdateSavingGoalProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(updateSavingGoalProgressService).mockResolvedValue(
      mockSavingGoal,
    );

    // Act
    const { result } = renderHook(() => useUpdateSavingGoalProgress(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ id: "saving-goal-123", data: { amount: 500 } });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Progress updated successfully");
    expect(updateSavingGoalProgressService).toHaveBeenCalledWith(
      "saving-goal-123",
      { amount: 500 },
    );
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(updateSavingGoalProgressService).mockRejectedValue(
      new Error("Amount exceeds target"),
    );

    // Act
    const { result } = renderHook(() => useUpdateSavingGoalProgress(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ id: "saving-goal-123", data: { amount: 99999 } });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useDeleteSavingGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(deleteSavingGoalService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useDeleteSavingGoal(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate("saving-goal-123");
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Saving goal deleted successfully",
    );
    expect(deleteSavingGoalService).toHaveBeenCalledWith("saving-goal-123");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(deleteSavingGoalService).mockRejectedValue(
      new Error("Not found"),
    );

    // Act
    const { result } = renderHook(() => useDeleteSavingGoal(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate("saving-goal-123");
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});
