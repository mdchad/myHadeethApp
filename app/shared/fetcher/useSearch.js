import { useMutation } from '@tanstack/react-query'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGetSearch() {
  return useMutation({
    mutationFn: async (query, page = 1, limit = 10) => {
      const res = await fetch(
        `${API_URL}/api/search?page=${page}&limit=${limit}&query=${query}`,
        {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )
      const result = await res.json()
      return result.data
    }
  })
}
