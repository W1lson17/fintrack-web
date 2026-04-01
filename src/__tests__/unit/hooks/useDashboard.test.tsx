/**
 * useDashboard Hook Unit Tests
 *
 * Tests dashboard hooks in isolation.
 * API calls are mocked — no real HTTP requests are made.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import {
  useMonthlySummary,
  useCategorySpending,
} from "@/features/dashboard/hooks/useDashboard";

// Mock dashboard service — no real API calls
vi.mock("@/features/dashboard/services/dashboard.service", () => ({
  getMonthlySummaryService: vi.fn(),
  getCategorySpendingService: vi.fn(),
}));

import {
  getMonthlySummaryService,
  getCategorySpendingService,
} from "@/features/dashboard/services/dashboard.service";

const mockParams = { month: 3, year: 2026 };

const mockMonthlySummary = {
  month: 3,
  year: 2026,
  totalIncome: 5000,
  totalExpenses: 1500,
  balance: 3500,
};

const mockCategorySpending = [
  { categoryName: "Comida", total: 1000 },
  { categoryName: "Transporte", total: 500 },
];

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

describe("useMonthlySummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return monthly summary on success", async () => {
    // Arrange
    vi.mocked(getMonthlySummaryService).mockResolvedValue(mockMonthlySummary);

    // Act
    const { result } = renderHook(() => useMonthlySummary(mockParams), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockMonthlySummary);
    expect(getMonthlySummaryService).toHaveBeenCalledWith(mockParams);
  });

  it("should refetch when params change", async () => {
    // Arrange
    vi.mocked(getMonthlySummaryService).mockResolvedValue(mockMonthlySummary);

    // Act
    const { result, rerender } = renderHook(
      ({ params }) => useMonthlySummary(params),
      { wrapper: createWrapper(), initialProps: { params: mockParams } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender({ params: { month: 4, year: 2026 } });

    // Assert
    await waitFor(() =>
      expect(getMonthlySummaryService).toHaveBeenCalledTimes(2),
    );
    expect(getMonthlySummaryService).toHaveBeenCalledWith({
      month: 4,
      year: 2026,
    });
  });

  it("should return error state on failure", async () => {
    // Arrange
    vi.mocked(getMonthlySummaryService).mockRejectedValue(
      new Error("Unauthorized"),
    );

    // Act
    const { result } = renderHook(() => useMonthlySummary(mockParams), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCategorySpending", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return category spending on success", async () => {
    // Arrange
    vi.mocked(getCategorySpendingService).mockResolvedValue(
      mockCategorySpending,
    );

    // Act
    const { result } = renderHook(() => useCategorySpending(mockParams), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCategorySpending);
    expect(getCategorySpendingService).toHaveBeenCalledWith(mockParams);
  });

  it("should refetch when params change", async () => {
    // Arrange
    vi.mocked(getCategorySpendingService).mockResolvedValue(
      mockCategorySpending,
    );

    // Act
    const { result, rerender } = renderHook(
      ({ params }) => useCategorySpending(params),
      { wrapper: createWrapper(), initialProps: { params: mockParams } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender({ params: { month: 4, year: 2026 } });

    // Assert
    await waitFor(() =>
      expect(getCategorySpendingService).toHaveBeenCalledTimes(2),
    );
    expect(getCategorySpendingService).toHaveBeenCalledWith({
      month: 4,
      year: 2026,
    });
  });

  it("should return error state on failure", async () => {
    // Arrange
    vi.mocked(getCategorySpendingService).mockRejectedValue(
      new Error("Unauthorized"),
    );

    // Act
    const { result } = renderHook(() => useCategorySpending(mockParams), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
