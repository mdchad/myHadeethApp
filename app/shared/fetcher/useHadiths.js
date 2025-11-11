import { useQueries, useQuery } from '@tanstack/react-query'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGetHadiths(bookId, volumeId) {
  return useQuery({
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
      const result = await res.json()
      return result.data
    }
  })
}

export function useGetHadith(hadithId) {
  return useQuery({
    queryKey: ['hadith', hadithId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/hadiths/${hadithId}`,
        {
          headers: {
            'User-Agent': 'MyWayApp/1.0.0'
          },
          method: 'GET'
        }
      )
      const result = await res.json()
      return result.data
    }
  })
}
