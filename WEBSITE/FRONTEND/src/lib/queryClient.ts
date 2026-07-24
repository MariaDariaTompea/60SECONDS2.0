import { QueryClient } from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attempt) => attempt * 1000,
      staleTime: 1000 * 5,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
  },
})

export default queryClient
