import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, Hadith, VolumeWithChapters } from '../../types'
import { apiGet } from '@/app/utils/api'

export default function useGetHadiths(bookId: string, volumeId: string) {
  return useQuery<VolumeWithChapters>({
    queryKey: ['hadiths', volumeId],
    queryFn: async () => {
      const result: ApiResponse<VolumeWithChapters> = await apiGet(
        `/api/books/${bookId}/${volumeId}`
      )
      return result.data
    },
  })
}

export function useGetHadith(hadithId: string | string[]) {
  return useQuery<Hadith>({
    queryKey: ['hadith', hadithId],
    queryFn: async () => {
      const result: ApiResponse<Hadith> = await apiGet(`/api/hadiths/${hadithId}`)
      return result.data
    },
  })
}
