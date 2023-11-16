import {useQuery} from "@tanstack/react-query";

export function useGetVolumes(id) {
  return useQuery({
    queryKey: ['volumes', id],
    queryFn: async () => {
      const res = await fetch(`https://my-way-web.vercel.app/api/books/${id}` , {
        method: 'GET',
      });
      const result = await res.json()
      return result.data
    }
  });
}
