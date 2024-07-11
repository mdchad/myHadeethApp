import {useQueries, useQuery} from '@tanstack/react-query'

export function useGetHadiths(bookId, volumeId) {
  return useQueries({
    queries: [
      {
        queryKey: ['hadiths', volumeId],
        queryFn: async () => {
          const res = await fetch(
            `https://my-way-web.vercel.app/api/books/${bookId}/${volumeId}`,
            {
              method: 'GET'
            }
          )
          const result = await res.json()
          return result.data
        }
      },
      {
        queryKey: ['hadithVolume', volumeId],
        queryFn: async () => {
          const res = await fetch(`https://my-way-web.vercel.app/api/volumes/${volumeId}`, {
            method: 'GET'
          })
          const result = await res.json()
          return result.data
        },
        networkMode: 'offlineFirst'
      }
    ]
  })
}

export function useGetHadith(hadithId) {
  return useQuery({
    queryKey: ['hadith', hadithId],
    queryFn: async () => {
      const res = await fetch(
        `https://my-way-web.vercel.app/api/hadiths/${hadithId}`,
        {
          method: 'GET'
        }
      )
      const result = await res.json()
      return result.data
    }
  })
}
