import { AsyncStorageKeys, SERVER_URL } from "@/constants";
import axios, { AxiosInstance } from "axios";
import { getToken, removeToken } from "./store";
import { Router } from "expo-router";
import { CustomToast } from "@/components/Toast";
import { printLogs } from "./logs";

const API_TIMEOUT = 30 * 1000;

export function getAxiosInstance(
    isTokenRequired: true
): Promise<AxiosInstance | null>;
export function getAxiosInstance(
    isTokenRequired: false
): Promise<AxiosInstance>;

export async function getAxiosInstance(isTokenRequired: boolean) {
    const token = await getToken(AsyncStorageKeys.token);
    if (isTokenRequired && !token) {
        return null;
    } else if (isTokenRequired && token) {
        return axios.create({
            baseURL: SERVER_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: false,
            timeout: API_TIMEOUT,
        });
    } else {
        return axios.create({
            baseURL: SERVER_URL,
            withCredentials: false,
            timeout: API_TIMEOUT,
        });
    }
}

export const clearStorageAndLogout = async (
    router: Router,
    message?: string
) => {
    await removeToken(AsyncStorageKeys.token);
    CustomToast.error(message || "Session Expired");
    router.replace("/(auth)/sign-in");
};
