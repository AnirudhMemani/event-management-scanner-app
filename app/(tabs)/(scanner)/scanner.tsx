import { CustomToast } from "@/components/Toast";
import { AsyncStorageKeys } from "@/constants";
import { printLogs } from "@/utils/logs";
import { getToken, removeToken } from "@/utils/store";
import axios from "axios";
import { CameraView } from "expo-camera";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    AppState,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { clearStorageAndLogout } from "@/utils/API";

export default function Home() {
    const [isCameraActive, setIsCameraActive] = useState(true);
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const router = useRouter();

    const validateQrCode = async (data: any) => {
        try {
            printLogs(data);
            const token = await getToken(AsyncStorageKeys.token);
            if (!token) {
                clearStorageAndLogout(router);
                return;
            }
            printLogs(token);
            const response = await axios.get(data, {
                headers: { Authorization: "Bearer " + token },
            });
            console.log(response.data);
            CustomToast.success("Meal availed successfully!");
            setIsCameraActive(false);
            router.replace("/(tabs)/(scanner)/scan");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    printLogs("Error response", error.response.data);
                    clearStorageAndLogout(router);
                    return;
                }
            }
            CustomToast.error("Failed to scan QR Code. Try again!");
            //@ts-ignore
            printLogs("meals request error", error?.response?.data);
            //@ts-ignore
            printLogs("meals request error status", error?.response?.status);
            setIsCameraActive(false);
            router.replace("/(tabs)/(scanner)/scan");
        }
    };

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    qrLock.current = false;
                    setIsCameraActive(true);
                }
                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
                options={{
                    title: "Overview",
                    headerShown: false,
                }}
            />
            {Platform.OS === "android" ? <StatusBar hidden /> : null}

            {/* Conditionally render the CameraView */}
            {isCameraActive && (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true;
                            setTimeout(async () => {
                                await validateQrCode(data);
                            }, 500);
                        }
                    }}
                />
            )}

            <Overlay />
        </SafeAreaView>
    );
}
