import { AsyncStorageKeys } from "@/constants";
import { getToken, removeToken } from "@/utils/store";
import { useCameraPermissions } from "expo-camera";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-root-toast";

export default function Home() {
    const [permission, requestPermission] = useCameraPermissions();

    const isPermissionGranted = Boolean(permission?.granted);

    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();

    const validateCameraPermissionStatus = async () => {
        if (!permission?.granted && !permission?.canAskAgain) {
            Toast.show(
                "You will have to manually grant camera access from app's permission settings",
                { duration: Toast.durations.LONG }
            );
        } else {
            await requestPermission();
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken(AsyncStorageKeys.token);
            setToken(token);
        };
        fetchToken();
    }, []);

    if (!token) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 items-center py-20 bg-black">
            <Stack.Screen options={{ title: "Overview", headerShown: false }} />
            <Text className="text-lg text-white">Meals Scanner</Text>
            <TouchableOpacity
                className="bg-[#0E7AFE] p-3 rounded-lg"
                onPress={async () => {
                    await removeToken(AsyncStorageKeys.token);
                    router.replace("/(auth)/sign-in");
                }}
            >
                <Text className="text-white font-bold text-lg text-center">
                    Logout
                </Text>
            </TouchableOpacity>
            <View className="space-y-2 my-auto">
                {!isPermissionGranted && (
                    <Pressable onPress={validateCameraPermissionStatus}>
                        <Text className="text-[#0E7AFE] text-lg text-center">
                            Request Camera Permission
                        </Text>
                    </Pressable>
                )}
                {isPermissionGranted && (
                    <View className="gap-3">
                        <Link
                            href={{
                                pathname: "/scanner",
                                params: { id: token },
                            }}
                            asChild
                        >
                            <TouchableOpacity className="bg-[#0E7AFE] p-3 rounded-lg">
                                <Text className="text-white font-bold text-lg text-center">
                                    Open QR Code Scanner
                                </Text>
                            </TouchableOpacity>
                        </Link>
                        <View className="flex-row">
                            <Text className="text-white text-center">
                                Unable to use the scanner?{" "}
                            </Text>
                            <Link
                                href={{
                                    pathname: "/avail-manually",
                                    params: { id: token },
                                }}
                                asChild
                            >
                                <Pressable>
                                    <Text className="text-[#0E7AFE] text-center underline">
                                        click here
                                    </Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
