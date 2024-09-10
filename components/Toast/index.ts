import Toast from "react-native-root-toast";

export const CustomToast = {
    success: (message: string, duration?: number) =>
        Toast.show(message, {
            backgroundColor: "green",
            textColor: "white",
            duration,
        }),
    error: (message: string, duration?: number) =>
        Toast.show(message, {
            backgroundColor: "red",
            textColor: "white",
            duration,
        }),
    info: (message: string, duration?: number) =>
        Toast.show(message, {
            backgroundColor: "blue",
            textColor: "white",
            duration,
        }),
} as const;
