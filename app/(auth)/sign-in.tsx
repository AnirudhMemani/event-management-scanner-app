import { URLS } from "@/constants";
import usePost from "@/hooks/usePost";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { setToken } from "@/utils/store";
import { router } from "expo-router";

const queryClient = new QueryClient();

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      const response = await axios.post(
        "https://2d9e-2404-7c00-48-89b4-799c-1d95-ce44-d0b0.ngrok-free.app/api/v1/auth/organizer/login",
        { email, password },
        { withCredentials: true }
      );

      if (response?.data?.success === true && response?.data) {
        const cookies = response.headers["set-cookie"];

        const accessTokenCookie = cookies?.find((cookie: any) =>
          cookie.startsWith("access_token=")
        );

        const token = accessTokenCookie?.split(";")[0].split("=")[1];

        if (token) await setToken("token", token);

        router.push("/(scanner)/scan");
      }

      // console.log("Response", response?.data);
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
            onChangeText={setEmail}
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3"
          onPress={handleLogin}
        >
          <Text className="text-center text-white text-lg font-bold">
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
