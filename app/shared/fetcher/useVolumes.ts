import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, Volume } from '../../types'
import { apiGet } from '@/app/utils/api'

export default function useGetVolumes(id: string) {
  return useQuery<Volume[]>({
    queryKey: ['volumes', id],
    queryFn: async () => {
      const result: ApiResponse<Volume[]> = await apiGet(`/api/books/${id}`)
      return result.data
    },
    networkMode: 'offlineFirst',
    placeholderData: (previousData) => previousData,
  })
}
