/**
 * useCategories Hook Unit Tests
 *
 * Tests category hooks in isolation.
 * API calls are mocked — no real HTTP requests are made.
 *
 * Pattern: AAA (Arrange, Act, Assert)
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";

// Mock category service — no real API calls
vi.mock("@/features/categories/services/category.service", () => ({
  getCategoriesService: vi.fn(),
  createCategoryService: vi.fn(),
  deleteCategoryService: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  getCategoriesService,
  createCategoryService,
  deleteCategoryService,
} from "@/features/categories/services/category.service";
import { toast } from "sonner";

const mockCategory = {
  id: "category-123",
  name: "Comida",
  type: "EXPENSE" as const,
  userId: "user-123",
  createdAt: new Date(),
};

const mockPaginatedResponse = {
  data: [mockCategory],
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

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated categories on success", async () => {
    // Arrange
    vi.mocked(getCategoriesService).mockResolvedValue(mockPaginatedResponse);

    // Act
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPaginatedResponse);
    expect(getCategoriesService).toHaveBeenCalledWith(undefined);
  });

  it("should pass pagination params to service", async () => {
    // Arrange
    vi.mocked(getCategoriesService).mockResolvedValue(mockPaginatedResponse);

    // Act
    const { result } = renderHook(() => useCategories({ page: 2, limit: 5 }), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getCategoriesService).toHaveBeenCalledWith({ page: 2, limit: 5 });
  });

  it("should return error state on failure", async () => {
    // Arrange
    vi.mocked(getCategoriesService).mockRejectedValue(
      new Error("Unauthorized"),
    );

    // Act
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(createCategoryService).mockResolvedValue(mockCategory);

    // Act
    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ name: "Comida", type: "EXPENSE" });
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Category created successfully");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(createCategoryService).mockRejectedValue(
      new Error("Already exists"),
    );

    // Act
    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate({ name: "Comida", type: "EXPENSE" });
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useDeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on success", async () => {
    // Arrange
    vi.mocked(deleteCategoryService).mockResolvedValue(undefined);

    // Act
    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate("category-123");
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Category deleted successfully");
    expect(deleteCategoryService).toHaveBeenCalledWith("category-123");
  });

  it("should show error toast on failure", async () => {
    // Arrange
    vi.mocked(deleteCategoryService).mockRejectedValue(new Error("Not found"));

    // Act
    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.mutate("category-123");
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});
