import { AsyncStorageKeys } from "@/constants";
import { getToken } from "@/utils/store";
import { Href, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const Page = () => {
    const [route, setRoute] = useState<Href | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken(AsyncStorageKeys.token);
            if (token) {
                setRoute("/(scanner)/scan");
            } else {
                setRoute("/(auth)/sign-in");
            }
        };

        checkToken();
    }, []);

    if (!route) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-white">Loading...</Text>
            </View>
        );
    }

    return <Redirect href={route} />;
};

export default Page;
