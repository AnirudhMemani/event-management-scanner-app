import Loader from "@/components/Loader";
import { CustomToast } from "@/components/Toast";
import { URLS } from "@/constants";
import { clearStorageAndLogout, getAxiosInstance } from "@/utils/API";
import { printLogs } from "@/utils/logs";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";

type TMeals = {
    date: string;
    totalMeals: number;
    mealsConsumed: number;
};

type TMealsData = {
    mealsConsumed: number;
    totalMeals: number;
};

type TResponse = {
    [key: string]: TMealsData;
};

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allMealCount, setAllMealCount] = useState<TMeals[] | null>(null);
    const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();

    const getTotalMealSummary = async () => {
        try {
            setIsLoading(true);
            const axiosInstance = await getAxiosInstance(true);
            if (!axiosInstance) {
                await clearStorageAndLogout(router);
                return;
            }
            const response = await axiosInstance.get(URLS.GET_ALL_MEALS);
            printLogs("Data:", response.data);
            printLogs("status:", response.status);

            if (response.data.success === true) {
                const data: TResponse = response.data.data;

                const mealsArray: TMeals[] = Object.keys(data).map((date) => ({
                    date,
                    totalMeals: data[date].totalMeals,
                    mealsConsumed: data[date].mealsConsumed,
                }));

                // Sort the mealsArray by date
                mealsArray.sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                setAllMealCount(mealsArray);

                const initialCollapsedState = mealsArray.reduce((acc, meal) => {
                    acc[meal.date] = true;
                    return acc;
                }, {} as { [key: string]: boolean });

                setCollapsed(initialCollapsedState);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    await clearStorageAndLogout(router);
                    return;
                }
            }
            CustomToast.error(
                "Couldn't fetch the data. An unknown error occurred"
            );
            printLogs(
                "Error getting total meals summary",
                // @ts-ignore
                error.response?.data
            );
            printLogs(
                "Error getting total meals summary status",
                // @ts-ignore
                error.response?.status
            );
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getTotalMealSummary();
        }, [])
    );

    const toggleCollapse = (date: string) => {
        setCollapsed((prev) => ({ ...prev, [date]: !prev[date] }));
    };

    return (
        <View className="flex-1 bg-black p-4 py-20">
            <Text className="text-white text-2xl mb-4 text-center">
                Meals Dashboard
            </Text>
            <ScrollView>
                {allMealCount && allMealCount.length > 0 ? (
                    allMealCount.map((meal, index) => (
                        <View
                            key={meal.date}
                            className="mb-4"
                        >
                            <TouchableOpacity
                                className="bg-[#333] p-2 rounded-lg"
                                onPress={() => toggleCollapse(meal.date)}
                            >
                                <Text className="text-white text-lg">
                                    {`${meal.date} | Day ${index + 1}`}
                                </Text>
                            </TouchableOpacity>
                            <Collapsible collapsed={collapsed[meal.date]}>
                                <View
                                    style={{
                                        backgroundColor: "#444",
                                        padding: 10,
                                        borderRadius: 5,
                                        marginTop: 5,
                                    }}
                                >
                                    <Text className="text-white">
                                        Total meals: {meal.totalMeals}
                                    </Text>
                                    <Text className="text-white">
                                        Meals consumed: {meal.mealsConsumed}
                                    </Text>
                                </View>
                            </Collapsible>
                        </View>
                    ))
                ) : (
                    <Text className="text-white">No meal data available</Text>
                )}
            </ScrollView>
            <Loader isVisible={isLoading} />
        </View>
    );
}
