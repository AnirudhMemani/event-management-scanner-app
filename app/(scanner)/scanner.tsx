import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocalSearchParams, useGlobalSearchParams, Link } from "expo-router";

export default function Home() {
  const [isCameraActive, setIsCameraActive] = useState(true); // Camera visibility state
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  const local = useLocalSearchParams();

  console.log(local.id);

  const token = local?.id;

  const availMeal = async (data: any) => {
    try {
      console.log(data);
      const response = await axios.get(data, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(response.status);
      alert("Meal availed successfully!!!");
      setIsCameraActive(false);
    } catch (error) {
      alert("Meal availed successfully");
      setIsCameraActive(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
        setIsCameraActive(true);
      }
      appState.current = nextAppState;
    });

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
                // await Linking.openURL(data);
                await availMeal(data);
              }, 500);
            }
          }}
        />
      )}

      <Overlay />
    </SafeAreaView>
  );
}
