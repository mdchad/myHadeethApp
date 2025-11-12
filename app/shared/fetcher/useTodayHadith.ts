import { useQuery } from '@tanstack/react-query'
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// TODO: Replace 'any' with proper TodayHadith type when hadith types are added
export function useGetTodayHadith() {
  const timeZone = 'Asia/Kuala_Lumpur';
  const nowInKualaLumpur = toZonedTime(new Date(), timeZone);
  const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd', { timeZone });

  return useQuery<any>({
    queryKey: ['todayHadith', formattedDate],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/today`, {
        headers: {
          'User-Agent': 'MyWayApp/1.0.0'
        },
        cache: 'no-store',
        method: 'GET'
      })
      const result: any = await res.json()
      return result
    },
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000 // Updated from deprecated cacheTime
  })
}
