import { useQuery } from '@tanstack/react-query'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGetVolumes(id) {
  return useQuery({
    queryKey: ['volumes', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        headers: {
          'User-Agent': 'MyWayApp/1.0.0'
        },
        method: 'GET'
      })
      const result = await res.json()
      return result.data
    },
    networkMode: 'offlineFirst'
  })
}