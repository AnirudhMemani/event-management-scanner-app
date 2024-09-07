"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import API from "@/utils/API";

// Get QueryClient from the context

const useDelete = (qkey: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    mutate: deleteMutation,
    isError,
    isSuccess,
    data,
    isPending,
  } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await API.delete(`${payload.urls}/${payload.id}`);
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
  return {
    deleteMutation,
    isError,
    isSuccess,
    data,
    error,
    success,
    isPending,
  };
};

export default useDelete;
