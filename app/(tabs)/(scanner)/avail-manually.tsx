import Dropdown from "@/components/Dropdown";
import { SERVER_URL, URLS } from "@/constants";
import { printLogs } from "@/utils/logs";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type TEntity = "Athlete" | "Manager" | "Coach";

type TDropdownData = {
    value: string;
    label: string;
    chestNumber?: string;
};

const entity = [
    { label: "Athlete", value: "athlete" },
    { label: "Coach", value: "coach" },
    { label: "Manager", value: "manager" },
];

export default function Page() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [schoolDetails, setSchoolDetails] = useState<TDropdownData[]>();
    const [entityDetails, setEntityDetails] = useState<TDropdownData[]>();

    const [selectedSchool, setSelectedSchool] = useState<TDropdownData>();
    const [selectedEntityType, setSelectedEntityType] =
        useState<TDropdownData>();
    const [selectedEntity, setSelectedEntity] = useState<TDropdownData>();

    const getAllSchools = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://api.pssemrevents.com${URLS.SCHOOL}`
            );
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
            printLogs("error getting all the schools", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAthletes = async (id: string) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://api.pssemrevents.com/api/v1/${selectedEntityType?.value}/school/${id}`
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
        } catch (error) {
            //@ts-ignore
            printLogs("error getting all the athletes", error.response.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllSchools();
    }, []);

    useEffect(() => {
        printLogs("selectedSchool", selectedSchool);
        if (selectedEntityType?.value && selectedSchool?.value) {
            getAthletes(selectedSchool?.value);
        }
    }, [selectedSchool, selectedEntityType]);

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
                            label="Select an entity..."
                            onSelect={setSelectedEntityType}
                        />
                    )}
                    {entityDetails && (
                        <Dropdown
                            data={entityDetails}
                            label="Select a school..."
                            onSelect={setSelectedEntity}
                        />
                    )}
                    {selectedEntity && (
                        // get meals from API and deduct meal if availed
                        <View className="gap-3 mt-6">
                            <Text className="text-white text-center text-lg">
                                This person has{" "}
                                <Text className="text-blue-600">3</Text> meals
                                remaining
                            </Text>
                            <TouchableOpacity className="bg-[#0E7AFE] p-3 rounded-lg">
                                <Text className="text-white font-bold text-lg text-center">
                                    Avail meal
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
