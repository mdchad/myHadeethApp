import { useQueries, useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '../../types'
import { apiGet } from '@/app/utils/api'

// TODO: Replace 'any' with proper Hadith type when hadith types are added
export default function useGetHadiths(bookId: string, volumeId: string): any {
  return useQuery<any[]>({
    queryKey: ['hadiths', volumeId],
    queryFn: async () => {
      const result: ApiResponse<any[]> = await apiGet(`/api/books/${bookId}/${volumeId}`)
      return result.data
    }
  })
}

// TODO: Replace 'any' with proper Hadith type when hadith types are added
export function useGetHadith(hadithId: string | string[]) {
  return useQuery<any>({
    queryKey: ['hadith', hadithId],
    queryFn: async () => {
      const result: ApiResponse<any> = await apiGet(`/api/hadiths/${hadithId}`)
      return result.data
    }
  })
}
