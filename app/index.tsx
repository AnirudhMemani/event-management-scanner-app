import { Redirect } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Page = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Redirect href="/(auth)/sign-in" />
      </QueryClientProvider>
    </>
  );
};

export default Page;
