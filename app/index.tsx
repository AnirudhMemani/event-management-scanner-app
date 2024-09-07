import { Redirect } from "expo-router";

const Page = () => {
  return (
    <>
      <Redirect href="/(auth)/sign-in" />
    </>
  );
};

export default Page;
