import FontAwesome from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "blue",
                tabBarInactiveBackgroundColor: "black",
                tabBarActiveBackgroundColor: "black",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            size={28}
                            name="home"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="(scanner)"
                options={{
                    title: "Scanner",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            size={28}
                            name="scan1"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
