import {useMutation} from '@tanstack/react-query'

export function useGetSearch() {
  return useMutation({
    mutationFn: async (query, page = 1, limit = 10) => {
      const res = await fetch(
        `https://my-way-web.vercel.app/api/search?page=${page}&limit=${limit}/${query}`,
        {
          method: 'GET'
        }
      )
      const result = await res.json()
      return result.data
    }
  })
}
