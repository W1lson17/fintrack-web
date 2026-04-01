/**
 * useTransactions Hook Unit Tests
 *
 * Tests transaction hooks in isolation.
 * API calls are mocked — no real HTTP requests are made.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from "@/features/transactions/hooks/useTransactions";

// Mock transaction service — no real API calls
vi.mock("@/features/transactions/services/transaction.service", () => ({
  getTransactionsService: vi.fn(),
  createTransactionService: vi.fn(),
  deleteTransactionService: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  getTransactionsService,
  createTransactionService,
  deleteTransactionService,
} from "@/features/transactions/services/transaction.service";
import { toast } from "sonner";

const mockTransaction = {
  id: "transaction-123",
  amount: 500,
  description: "Supermarket",
  type: "EXPENSE" as const,
  date: "2026-03-21T12:00:00.000Z",
  categoryId: "category-123",
  userId: "user-123",
  createdAt: "2026-03-21T12:00:00.000Z",
  category: {
    id: "category-123",
    name: "Comida",
    type: "EXPENSE" as const,
    userId: "user-123",
    createdAt: "2026-03-21T12:00:00.000Z",
  },
};

const mockPaginatedResponse = {
  data: [mockTransaction],
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

describe("useTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated transactions on success", async () => {
    // Arrange
    vi.mocked(getTransactionsService).mockResolvedValue(mockPaginatedResponse);

    // Act
    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPaginatedResponse);
    expect(getTransactionsService).toHaveBeenCalledWith(undefined);
  });

  it("should pass filter params to service", async () => {
    // Arrange
    vi.mocked(getTransactionsService).mockResolvedValue(mockPaginatedResponse);
    const params = { type: "EXPENSE" as const, page: 1, limit: 10 };

    // Act
    const { result } = renderHook(() => useTransactions(params), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getTransactionsService).toHaveBeenCalledWith(params);
  });

  it("should return error state on failure", async () => {
    // Arrange
    vi.mocked(getTransactionsService).mockRejectedValue(
      new Error("Unauthorized"),
    );

    // Act
    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(createTransactionService).mockResolvedValue(mockTransaction);

    // Act
    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        amount: 500,
        type: "EXPENSE",
        categoryId: "category-123",
        description: "Supermarket",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Transaction created successfully",
    );
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(createTransactionService).mockRejectedValue(
      new Error("Network error"),
    );

    // Act
    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({
        amount: 500,
        type: "EXPENSE",
        categoryId: "category-123",
      });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useDeleteTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(deleteTransactionService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useDeleteTransaction(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate("transaction-123");
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Transaction deleted successfully",
    );
    expect(deleteTransactionService).toHaveBeenCalledWith("transaction-123");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(deleteTransactionService).mockRejectedValue(
      new Error("Not found"),
    );

    // Act
    const { result } = renderHook(() => useDeleteTransaction(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate("transaction-123");
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});
