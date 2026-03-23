import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * QueryClient configuration
 *
 * - staleTime: 1 minute — data is considered fresh for 60 seconds before refetching
 * - retry: 1 — only retry failed queries once before showing an error
 * - mutations.retry: 0 — never retry failed mutations automatically
 *   (auth errors like 401/429 should not be retried — they are intentional responses)
 * - refetchOnWindowFocus: false — prevents unnecessary refetches when switching tabs
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
