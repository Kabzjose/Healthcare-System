import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,           // always refetch — payment status must be current
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,  // refetch when patient returns from Stripe
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});