import { useMutation } from '@tanstack/react-query'
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
        {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )
      const result: ApiResponse<any[]> = await res.json()
      return result.data
    }
  })
}
