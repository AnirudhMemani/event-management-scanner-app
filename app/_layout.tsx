import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <RootSiblingParent>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </QueryClientProvider>
        </RootSiblingParent>
    );
}
