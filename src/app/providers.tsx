import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

/**
 * QueryClient configuration
 *
 * - staleTime: 1 minute — data is considered fresh for 60 seconds before refetching
 * - retry: 1 — only retry failed requests once before showing an error
 * - refetchOnWindowFocus: false — prevents unnecessary refetches when switching tabs
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * AppProviders component
 *
 * Wraps the application with all global providers.
 * Add new providers here as the app grows.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Sonner toast notifications — positioned top-right by default */}
      <Toaster richColors closeButton position="top-right" />
    </QueryClientProvider>
  );
};
