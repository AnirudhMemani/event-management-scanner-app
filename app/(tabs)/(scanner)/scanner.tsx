import Loader from "@/components/Loader";
import { CustomToast } from "@/components/Toast";
import { clearStorageAndLogout, getAxiosInstance } from "@/utils/API";
import { printLogs } from "@/utils/logs";
import axios from "axios";
import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    AppState,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";

export default function Home() {
    const [isCameraActive, setIsCameraActive] = useState(true);
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const validateQrCode = async (data: string) => {
        try {
            printLogs(data);

            const parts = data.split("/");

            const url = parts.slice(3).join("/");

            printLogs("url", url);

            const axiosInstance = await getAxiosInstance(true);

            if (!axiosInstance) {
                clearStorageAndLogout(router);
                return;
            }

            setIsLoading(true);

            const response = await axiosInstance.get(`/${url}`);

            if (response.data.success === true) {
                const data = response.data.data;
                console.log("verify meal response", data);
                CustomToast.success(
                    `${data.name}'s meal availed successfully. ${data.name} has ${data.mealsRemaining} remaining`
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    printLogs("Error response", error.response.data);
                    clearStorageAndLogout(router);
                } else if (error.response?.status === 404) {
                    CustomToast.error("Not eligible to avail meal");
                } else if (error.response?.status === 400) {
                    CustomToast.error(
                        "This person has exhauted their meals for the today"
                    );
                } else if (error.response?.status === 402) {
                    CustomToast.error("This person has been applied for meals");
                } else {
                    CustomToast.error(
                        "Internal server error. Try again later!"
                    );
                }
                return;
            }
            CustomToast.error("Failed to scan QR Code. Try again!");
        } finally {
            setIsCameraActive(false);
            router.replace("/(tabs)/(scanner)/scan");
            setIsLoading(false);
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
            <Loader isVisible={isLoading} />
        </SafeAreaView>
    );
}
