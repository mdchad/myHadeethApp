import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, BookListItem } from '../../types'
import { apiGet } from '@/app/utils/api'

export default function useGetBooks() {
  return useQuery<BookListItem[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const result: ApiResponse<BookListItem[]> = await apiGet('/api/books')
      return result.data
    },
    networkMode: 'offlineFirst',
    placeholderData: (previousData) => previousData,
  })
}
