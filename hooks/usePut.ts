import API from "@/utils/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const usePut = (qkey: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    mutate: putMutation,
    isError,
    isSuccess,
    data,
    isPending,
  } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await API.put(payload.urls, { ...payload.data });
      return data;
    },
    onError(error) {
      setSuccess(false);
      setError((error as any).response.data.message);
      setTimeout(() => {
        setError(false);
      }, 2000);
    },
    onSuccess: async () => {
      setSuccess(true);

      if (qkey != "false")
        var a = await queryClient.invalidateQueries({ queryKey: [qkey] });
    },
  });
  return { putMutation, isError, isSuccess, data, error, success, isPending };
};
export default usePut;
