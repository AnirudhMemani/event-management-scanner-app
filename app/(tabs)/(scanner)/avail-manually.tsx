import Dropdown, { ITruckProps } from "@/components/Dropdown";
import Loader from "@/components/Loader";
import { CustomToast } from "@/components/Toast";
import { URLS } from "@/constants";
import { clearStorageAndLogout, getAxiosInstance } from "@/utils/API";
import { printLogs } from "@/utils/logs";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

type TEntity = { label: string; value: "athlete" | "manager" | "coach" };

type TDropdownData = {
    value: string;
    label: string;
    chestNumber?: string;
};

const entity: TEntity[] = [
    { label: "Athlete", value: "athlete" },
    { label: "Coach", value: "coach" },
    { label: "Manager", value: "manager" },
];

export default function Page() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [schoolDetails, setSchoolDetails] = useState<TDropdownData[]>();
    const [entityDetails, setEntityDetails] = useState<TDropdownData[]>();

    const [selectedSchool, setSelectedSchool] = useState<TDropdownData>();
    const [selectedEntityType, setSelectedEntityType] = useState<TEntity>();
    const [selectedEntity, setSelectedEntity] = useState<TDropdownData>();

    const [remainingMeals, setRemainingMeals] = useState<number | null>(null);

    const router = useRouter();

    const getRequestBody = (id: string) => {
        return selectedEntityType?.value === "athlete"
            ? { registrationId: id }
            : selectedEntityType?.value === "manager"
            ? { managerId: id }
            : { coachId: id };
    };

    const getAllSchools = async () => {
        try {
            setIsLoading(true);
            const axiosInstance = await getAxiosInstance(true);
            if (!axiosInstance) {
                clearStorageAndLogout(router);
                return;
            }
            const response = await axiosInstance.get(URLS.SCHOOL);
            if (response.data.success === true) {
                const data = response.data.data as any[];
                setSchoolDetails(
                    data.map((school) => ({
                        value: school.affiliationNumber,
                        label: school.name,
                    }))
                );
            }
        } catch (error) {
            //@ts-ignore
            printLogs("error getting all the schools", error.response.data);
            //@ts-ignore
            printLogs("error getting all the schools", error.response.status);
        } finally {
            setIsLoading(false);
        }
    };

    const getAthletes = async (id: string) => {
        try {
            setIsLoading(true);
            const axiosInstance = await getAxiosInstance(true);
            if (!axiosInstance) {
                clearStorageAndLogout(router);
                return;
            }
            const response = await axiosInstance.get(
                `/api/v1/${selectedEntityType?.value}/school/${id}`
            );
            if (response.data.success === true) {
                const data = response.data.data as any[];
                setEntityDetails(
                    data.map((entity) => ({
                        value: entity.registrationId,
                        label: entity.name,
                        chestNumber: entity.chestNumber,
                    }))
                );
            }
            // localhost:3000/api/v1/meal/get-meal-details
        } catch (error) {
            //@ts-ignore
            printLogs("error getting all the entities", error.response.data);
            //@ts-ignore
            printLogs("error getting all the entities", error.response.status);
        } finally {
            setIsLoading(false);
        }
    };

    const getRemainingMealCount = async (id: string) => {
        try {
            setIsLoading(true);
            const axiosInstance = await getAxiosInstance(true);
            if (!axiosInstance) {
                clearStorageAndLogout(router);
                return;
            }
            printLogs("selected entity value", selectedEntity?.value);
            printLogs("selectedEntityType value", selectedEntityType?.value);
            const requestBody = getRequestBody(id);
            printLogs("requestBody", requestBody);
            const response = await axiosInstance.post(
                URLS.GET_MEAL_DETAILS,
                requestBody
            );
            printLogs("Response data for remaining meals", response.data.data);
            if (response.data.success === true) {
                const { data } = response.data;

                const today = format(new Date(), "yyyy-MM-dd");

                const mealsForToday = data.mealDetails[today] || 0;

                setRemainingMeals(Number(mealsForToday));
            }
        } catch (error) {
            //@ts-ignore
            printLogs("error getting all the meals", error.response.data);
            //@ts-ignore
            printLogs("error getting all the meals", error.response.status);
            setRemainingMeals(null);
        } finally {
            setIsLoading(false);
        }
    };

    const availMeal = async () => {
        try {
            const axiosInstance = await getAxiosInstance(true);
            if (!axiosInstance) {
                await clearStorageAndLogout(router);
                return;
            }
            const query =
                selectedEntityType?.value === "athlete"
                    ? "registrationId=" + selectedEntity?.value
                    : selectedEntityType?.value === "manager"
                    ? "managerId=" + selectedEntity?.value
                    : "coachId=" + selectedEntity?.value;
            const response = await axiosInstance.get(
                `${URLS.CLAIM_MEAL}?${query}`
            );
            if (response.data.success === true) {
                const data = response.data.data;
                console.log("verify meal response", data);
                CustomToast.success(
                    `${data.name}'s meal availed successfully. ${data.name} has ${data.mealsRemaining} remaining`
                );
                router.replace("/(scanner)/scan");
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
                router.replace("/(tabs)/(scanner)/scan");
                return;
            }
            CustomToast.error("Failed to scan QR Code. Try again!");
            router.replace("/(tabs)/(scanner)/scan");
        }
    };

    useEffect(() => {
        setSelectedSchool(undefined);
        getAllSchools();
    }, []);

    useEffect(() => {
        setSelectedEntityType(undefined);
        setSelectedEntity(undefined);
        setEntityDetails(undefined);
    }, [selectedSchool]);

    useEffect(() => {
        if (selectedEntityType?.value && selectedSchool?.value) {
            setSelectedEntity(undefined);
            getAthletes(selectedSchool?.value);
        }
    }, [selectedEntityType]);

    useEffect(() => {
        if (selectedEntity?.value) {
            printLogs("selectedEntity's id:", selectedEntity);
            getRemainingMealCount(selectedEntity?.value);
        }
    }, [selectedEntity]);

    return (
        <SafeAreaView className="flex-1 bg-black py-20">
            <View className="items-center">
                <Text className="text-white text-xl mb-10 font-bold">
                    Meal Approval Form
                </Text>
                <View className="h-full w-full">
                    {schoolDetails && (
                        <Dropdown
                            data={schoolDetails}
                            label="Select a school..."
                            onSelect={setSelectedSchool}
                            selected={selectedSchool}
                        />
                    )}
                    {selectedSchool && (
                        <Dropdown
                            data={entity}
                            label="Select an entity type..."
                            onSelect={
                                setSelectedEntityType as (
                                    item: ITruckProps
                                ) => void
                            }
                            selected={selectedEntityType}
                        />
                    )}
                    {entityDetails && (
                        <Dropdown
                            data={entityDetails}
                            label="Select an entity..."
                            onSelect={setSelectedEntity}
                            selected={selectedEntity}
                        />
                    )}
                    {selectedEntity && (
                        <View className="gap-3 mt-6">
                            <Text className="text-white text-center text-lg">
                                This person has{" "}
                                <Text className="text-blue-600">
                                    {remainingMeals || 0}
                                </Text>{" "}
                                meals remaining
                            </Text>
                            {remainingMeals && remainingMeals > 0 && (
                                <TouchableOpacity
                                    className="bg-[#0E7AFE] p-3 rounded-lg"
                                    onPress={availMeal}
                                >
                                    <Text className="text-white font-bold text-lg text-center">
                                        Avail meal
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
            <Loader isVisible={isLoading} />
        </SafeAreaView>
    );
}
