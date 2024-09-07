import API from "@/utils/API";
import { useQuery } from "@tanstack/react-query";

const useList = (qkey: string, urls: string, page?: number, limit?: number) => {
  const str = JSON.stringify({ page, limit });

  const { isError, isLoading, data } = useQuery({
    queryKey: [qkey, str],
    queryFn: async () => {
      const params = {
        page: page,
        limit: limit,
      };
      const { data } = await API.get(urls, { params });

      return data;
    },
  });

  return { isError, isLoading, data };
};

export default useList;
