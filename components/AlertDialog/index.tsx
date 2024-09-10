import { SetStateAction } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type TAlertDialogProps = {
    isVisible: boolean;
    setIsVisible: React.Dispatch<SetStateAction<boolean>>;
    title?: string;
    description?: string;
    positiveOnClick?: () => void;
    negativeOnClick?: () => void;
    children?: React.ReactNode;
};

export default function AlertDialog({
    isVisible,
    setIsVisible,
    title,
    description,
    negativeOnClick,
    positiveOnClick,
    children,
}: TAlertDialogProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
        >
            <TouchableOpacity
                onPress={() => setIsVisible(false)}
                className="flex-1"
                activeOpacity={1}
            >
                <View />
            </TouchableOpacity>
            <View className="items-center justify-center w-full absolute h-full">
                <View className="border p-6 rounded-lg bg-black w-[90%]">
                    <View className="gap-2 mb-10">
                        <Text className="text-white text-lg">{title}</Text>
                        <Text className="text-white/70">{description}</Text>
                    </View>
                    <View className="gap-3">
                        <TouchableOpacity
                            className={`bg-blue-500 rounded-lg py-2`}
                            onPress={positiveOnClick}
                        >
                            <Text className="text-center text-white text-lg font-bold">
                                Submit
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`py-2 border border-blue-600 rounded-lg`}
                            onPress={negativeOnClick}
                        >
                            <Text className="text-center text-white text-lg font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {children}
            </View>
        </Modal>
    );
}
