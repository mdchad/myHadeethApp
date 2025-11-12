import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '../../types'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// TODO: Replace 'any' with proper Volume type when hadith types are added
export function useGetVolumes(id: string) {
  return useQuery<any[]>({
    queryKey: ['volumes', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        headers: {
          'User-Agent': 'MyWayApp/1.0.0'
        },
        method: 'GET'
      })
      const result: ApiResponse<any[]> = await res.json()
      return result.data
    },
    networkMode: 'offlineFirst'
  })
}