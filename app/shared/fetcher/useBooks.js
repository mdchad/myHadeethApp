import { useQuery } from '@tanstack/react-query'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGetBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/books`, {
        method: 'GET'
      })
      const result = await res.json()
      return result.data
    },
    networkMode: "offlineFirst"
  })
}
