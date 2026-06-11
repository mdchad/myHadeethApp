import { useMutation } from '@tanstack/react-query'
import type { SearchParams, SearchResult, SearchApiResponse } from '../../types'
import { apiGet } from '@/app/utils/api'

export default function useGetSearch() {
  return useMutation<SearchResult, Error, SearchParams>({
    mutationFn: async ({ query, page = 1, limit = 10, mode = 'text', books }) => {
      const params = new URLSearchParams({
        term: query,
        page: page.toString(),
        limit: limit.toString(),
        mode,
      });

      // Only add books parameter if provided
      if (books) {
        params.append('books', books);
      }

      // Semantic search on a cold embed cache can take a while — allow more
      // than the default timeout, but keep it bounded.
      const result: SearchApiResponse = await apiGet(
        `/api/search?${params.toString()}`,
        { timeoutMs: 60_000 }
      )

      if (!result.success) {
        throw new Error('Search request was not successful');
      }
      return result.data
    }
  })
}
