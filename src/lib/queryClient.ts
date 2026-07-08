import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 1 minute — won't refetch if navigating back within 1 min
      staleTime: 60 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once before showing error
      retry: 1,
      // Refetch when user switches back to the browser tab
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0, // Never retry mutations — don't accidentally double-book
    },
  },
});