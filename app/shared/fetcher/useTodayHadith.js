import { useQuery } from '@tanstack/react-query'

export function useGetTodayHadith() {
  return useQuery({
    queryKey: ['todayHadith'],
    queryFn: async () => {
      const res = await fetch(`https://my-way-web.vercel.app/api/today`, {
        method: 'GET'
      })
      const result = await res.json()
      return result
    },
    networkMode: 'offlineFirst'
  })
}
