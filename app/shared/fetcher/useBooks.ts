import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '../../types'
import { apiGet } from '@/app/utils/api'

// TODO: Replace 'any' with proper Book type when hadith types are added
export default function useGetBooks() {
  return useQuery<any[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const result: ApiResponse<any[]> = await apiGet('/api/books')
      return result.data
    },
    networkMode: "offlineFirst",
    placeholderData: (previousData) => previousData
  })
}
