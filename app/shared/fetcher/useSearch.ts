import { useMutation } from '@tanstack/react-query'
<<<<<<< Updated upstream
import type { ApiResponse } from '../../types'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

// TODO: Replace 'any' with proper SearchResult type when hadith types are added
export default function useGetSearch() {
  return useMutation<any[], Error, SearchParams>({
    mutationFn: async ({ query, page = 1, limit = 10 }) => {
      const res = await fetch(
        `${API_URL}/api/search?page=${page}&limit=${limit}&query=${query}`,
=======
import type { SearchParams, SearchResult, SearchApiResponse } from '../../types'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useGetSearch() {
  return useMutation<SearchResult, Error, SearchParams>({
    mutationFn: async ({ query, page = 1, limit = 10, mode = 'text', books }) => {
      const params = new URLSearchParams({
        query,
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
>>>>>>> Stashed changes
        {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )
<<<<<<< Updated upstream
      const result: ApiResponse<any[]> = await res.json()
=======

      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }

      const result: SearchApiResponse = await res.json()

      if (!result.success) {
        throw new Error('Search request was not successful');
      }

>>>>>>> Stashed changes
      return result.data
    }
  })
}
