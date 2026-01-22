import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '../../types'
import { apiGet } from '@/app/utils/api'

// TODO: Replace 'any' with proper Volume type when hadith types are added
export default function useGetVolumes(id: string) {
  return useQuery<any[]>({
    queryKey: ['volumes', id],
    queryFn: async () => {
      const result: ApiResponse<any[]> = await apiGet(`/api/books/${id}`)
      return result.data
    },
    networkMode: 'offlineFirst',
    placeholderData: (previousData) => previousData
  })
}