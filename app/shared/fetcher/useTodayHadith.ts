import { useQuery } from '@tanstack/react-query'
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { apiFetch } from '@/app/utils/api'

// TODO: Replace 'any' with proper TodayHadith type when hadith types are added
export default function useGetTodayHadith() {
  const timeZone = 'Asia/Kuala_Lumpur';
  const nowInKualaLumpur = toZonedTime(new Date(), timeZone);
  const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd', { timeZone });

  return useQuery<any>({
    queryKey: ['todayHadith', formattedDate],
    queryFn: async () => {
      const result = await apiFetch('/api/today', {
        method: 'GET',
        cache: 'no-store'
      })
      return result
    },
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000, // Updated from deprecated cacheTime
    placeholderData: (previousData: any) => previousData
  })
}
