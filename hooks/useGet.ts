import API from "@/utils/API";
import { useQuery } from "@tanstack/react-query";

const useGet = (qkey: string, urls: string, id: string, suffix?: string) => {
  const { isError, isLoading, data } = useQuery({
    queryKey: [qkey, id, suffix],
    queryFn: async () => {
      const endpoint = suffix ? `${urls}/${id}/${suffix}` : `${urls}/${id}`;
      const { data } = await API.get(endpoint);
      return data;
    },
  });
  return { isError, isLoading, data };
};

export default useGet;
