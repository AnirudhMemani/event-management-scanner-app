import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="scan" options={{ headerShown: false }} />
      <Stack.Screen name="scanner" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
