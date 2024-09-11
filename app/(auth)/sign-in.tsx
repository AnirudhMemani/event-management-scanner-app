import { CustomToast } from "@/components/Toast";
import { AsyncStorageKeys, URLS } from "@/constants";
import { getAxiosInstance } from "@/utils/API";
import { setToken, setUserDetails } from "@/utils/store";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            return;
        }
        try {
            setIsLoading(true);
            const requestBody = { email, password };

            const axiosInstance = await getAxiosInstance(false);
            const response = await axiosInstance.post(URLS.LOGIN, requestBody);

            if (response?.data?.success === true && response?.data) {
                const data = response.data.data;
                const token = data.access_token;
                if (token) {
                    await setToken(AsyncStorageKeys.token, token);
                    await setUserDetails(AsyncStorageKeys.user, data);
                    CustomToast.success("Logged in!");
                    router.replace("/(tabs)/(scanner)/scan");
                } else {
                    CustomToast.error("Login failed!");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    CustomToast.error("Invalid credentials!");
                    return;
                }
            }
            CustomToast.error("Login failed, try again later!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center bg-white p-6">
                <Text className="text-2xl font-bold text-center mb-6 text-blue-500">
                    Welcome Back!
                </Text>
                <View className="mb-4">
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
                        placeholder="Email"
                        placeholderTextColor="gray"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                        editable={!isLoading}
                    />
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        editable={!isLoading}
                    />
                </View>
                <TouchableOpacity
                    className={`bg-blue-500 rounded-lg py-3 ${
                        isLoading ? "pointer-events-none brightness-50" : ""
                    }`}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text className="text-center text-white text-lg font-bold">
                        {isLoading ? "Logging in..." : "Log In"}
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
          className="mt-4"
          onPress={() => Alert.alert("Forgot Password?")}
        >
          <Text className="text-center text-blue-500">
            Forgot your password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-8"
          onPress={() => Alert.alert("Sign Up")}
        >
          <Text className="text-center text-gray-500">
            Don't have an account?{" "}
            <Text className="text-blue-500 font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}
