import { useMutation } from '@tanstack/react-query'
import type { SearchParams, SearchResult, SearchApiResponse } from '../../types'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

      const res = await fetch(
        `${API_URL}/api/search?${params.toString()}`,
        {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )

      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }

      const result: SearchApiResponse = await res.json()

      if (!result.success) {
        throw new Error('Search request was not successful');
      }
      return result.data
    }
  })
}
