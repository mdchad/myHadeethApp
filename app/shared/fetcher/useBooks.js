import { useQuery } from '@tanstack/react-query'

export function useGetBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('https://my-way-web.vercel.app/api/books', {
        method: 'GET'
      })
      const result = await res.json()
      return result.data
    }
  })
}
