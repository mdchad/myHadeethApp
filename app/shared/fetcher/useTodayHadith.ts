import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { apiFetch } from '@/app/utils/api'
import type { HadithPreview } from '../../types'

type TodayResponse = HadithPreview | null | {
  updateRequired: boolean
  message: string
  minimumVersion: string
  currentVersion: string
  releaseNotes?: string
}

export default function useGetTodayHadith() {
  const timeZone = 'Asia/Kuala_Lumpur'
  const nowInKualaLumpur = toZonedTime(new Date(), timeZone)
  const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd')

  return useQuery<TodayResponse>({
    queryKey: ['todayHadith', formattedDate],
    queryFn: async () => {
      const result = await apiFetch<TodayResponse>('/api/today', {
        method: 'GET',
        cache: 'no-store',
      })
      return result
    },
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    placeholderData: (previousData: any) => previousData,
  })
}
