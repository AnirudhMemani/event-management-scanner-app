import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import API from "@/utils/API";

// Get QueryClient from the context

const usePost = (qkey: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    mutate: postMutation,
    isError,
    isSuccess,
    data,
    isPending,
  } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await API.post(payload.urls, { ...payload.data });
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
  return { postMutation, isError, isSuccess, data, error, success, isPending };
};

export default usePost;
