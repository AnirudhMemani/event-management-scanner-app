import AlertDialog from "@/components/AlertDialog";
import Loader from "@/components/Loader";
import { CustomToast } from "@/components/Toast";
import { clearStorageAndLogout } from "@/utils/API";
import { printLogs } from "@/utils/logs";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function Logout() {
    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useFocusEffect(
        React.useCallback(() => {
            setShowModal(true);

            return () => setShowModal(false);
        }, [])
    );

    useEffect(() => {
        if (!showModal) {
            router.replace("/(scanner)/scan");
        }
    }, [showModal]);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await clearStorageAndLogout(router, "Logged out successfully");
        } catch (error) {
            printLogs("Error logging out:", error);
            CustomToast.error("Error logging out");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <AlertDialog
                isVisible={showModal}
                setIsVisible={setShowModal}
                title="You are about to logout"
                description="Are you sure you want to logout?"
                positiveOnClick={handleLogout}
                negativeOnClick={() => router.replace("/(scanner)/scan")}
            />
            <Loader isVisible={isLoading} />
        </View>
    );
}
