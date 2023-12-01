import { useQuery } from '@tanstack/react-query'
import {format} from "date-fns";
import {zonedTimeToUtc} from "date-fns-tz";

export function useGetTodayHadith() {
  const timeZone = 'Asia/Kuala_Lumpur';
  const nowInKualaLumpur = zonedTimeToUtc(new Date(), timeZone);
  const formattedDate = format(nowInKualaLumpur, 'yyyy-MM-dd', { timeZone });

  return useQuery({
    queryKey: ['todayHadith', formattedDate],
    queryFn: async () => {
      const res = await fetch(`https://my-way-web.vercel.app/api/today`, {
        cache: 'no-store',
        method: 'GET'
      })
      const result = await res.json()
      return result
    },
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000
  })
}
