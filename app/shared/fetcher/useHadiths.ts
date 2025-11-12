import { useQueries, useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '../../types'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// TODO: Replace 'any' with proper Hadith type when hadith types are added
export function useGetHadiths(bookId: string, volumeId: string) {
  return useQuery<any[]>({
    queryKey: ['hadiths', volumeId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/books/${bookId}/${volumeId}`, {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )
      const result: ApiResponse<any[]> = await res.json()
      return result.data
    }
  })
}

// TODO: Replace 'any' with proper Hadith type when hadith types are added
export function useGetHadith(hadithId: string) {
  return useQuery<any>({
    queryKey: ['hadith', hadithId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/hadiths/${hadithId}`, {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )
      const result: ApiResponse<any> = await res.json()
      return result.data
    }
  })
}
