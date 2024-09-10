import AsyncStorage from "@react-native-async-storage/async-storage";
import { printLogs } from "./logs";

// Save token in AsyncStorage
export const setToken = async (tokenKey: string, token: string) => {
    try {
        await AsyncStorage.setItem(tokenKey, token);
    } catch (e) {
        printLogs("Error saving token to AsyncStorage:", e);
    }
};

// Get token from AsyncStorage
export const getToken = async (tokenKey: string) => {
    try {
        const token = await AsyncStorage.getItem(tokenKey);
        return token;
    } catch (e) {
        printLogs("Error getting token from AsyncStorage:", e);
        return null;
    }
};

// Remove token from AsyncStorage (optional, if you need logout functionality)
export const removeToken = async (tokenKey: string) => {
    try {
        await AsyncStorage.removeItem(tokenKey);
    } catch (e) {
        printLogs("Error removing token from AsyncStorage:", e);
    }
};

export const setUserDetails = async (
    userToken: string,
    user: { userId: string; email: string }
) => {
    try {
        await AsyncStorage.setItem(userToken, JSON.stringify(user));
    } catch (error) {
        printLogs("Error saving user details to AsyncStorage:", error);
    }
};

export const getUserDetails = async (userToken: string) => {
    try {
        const user = await AsyncStorage.getItem(userToken);
        return user;
    } catch (error) {
        printLogs("Error getting user details from AsyncStorage:", error);
    }
};
