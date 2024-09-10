import Dropdown, { ITruckProps } from "@/components/Dropdown";
import Loader from "@/components/Loader";
import { URLS } from "@/constants";
import { clearStorageAndLogout, getAxiosInstance } from "@/utils/API";
import { printLogs } from "@/utils/logs";
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

    const getAllSchools = async () => {
        try {
            setIsLoading(true);
            const axiosInstance = await getAxiosInstance(true);
            if (!axiosInstance) {
                clearStorageAndLogout(router);
                return;
            }
            const response = await axiosInstance.get(URLS.SCHOOL);
            printLogs("Response data for schools", response.data);
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
            printLogs("Response data for athletes", response.data);
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
            const requestBody =
                selectedEntityType?.value === "athlete"
                    ? { registrationId: selectedEntity?.value }
                    : selectedEntityType?.value === "manager"
                    ? { managerId: selectedEntity?.value }
                    : { coachId: selectedEntity?.value };
            printLogs("requestBody", requestBody);
            const response = await axiosInstance.post(
                "/api/v1/meal/get-meal-details",
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

    useEffect(() => {
        getAllSchools();
    }, []);

    useEffect(() => {
        setSelectedEntityType(undefined);
        setSelectedEntity(undefined);
        setEntityDetails(undefined);
    }, [selectedSchool]);

    useEffect(() => {
        printLogs("selectedSchool", selectedSchool);
        if (selectedEntityType?.value && selectedSchool?.value) {
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
                        />
                    )}
                    {entityDetails && (
                        <Dropdown
                            data={entityDetails}
                            label="Select an entity..."
                            onSelect={setSelectedEntity}
                        />
                    )}
                    {selectedEntity && (
                        // get meals from API and deduct meal if availed
                        <View className="gap-3 mt-6">
                            <Text className="text-white text-center text-lg">
                                This person has{" "}
                                <Text className="text-blue-600">
                                    {remainingMeals || 0}
                                </Text>{" "}
                                meals remaining
                            </Text>
                            {remainingMeals && remainingMeals > 0 && (
                                <TouchableOpacity className="bg-[#0E7AFE] p-3 rounded-lg">
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
