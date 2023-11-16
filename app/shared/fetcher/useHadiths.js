import { useQuery } from '@tanstack/react-query'

export function useGetHadiths(bookId, volumeId) {
  return useQuery({
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
  })
}
