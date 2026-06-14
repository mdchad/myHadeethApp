import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, Book } from '../../types'
import { apiGet } from '@/app/utils/api'

export default function useGetBooks() {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const result: ApiResponse<Book[]> = await apiGet('/api/books')
      return result.data
    },
    networkMode: 'offlineFirst',
    placeholderData: (previousData) => previousData,
  })
}
