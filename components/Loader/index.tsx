import { View, Animated } from "react-native";

const Loader = ({ isVisible }: { isVisible: boolean }) => {
    const loadingImage = require("../../assets/images/loader.gif");
    if (isVisible)
        return (
            <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/70 z-50">
                <Animated.Image
                    source={loadingImage}
                    resizeMode={"center"}
                    className="justify-center items-center content-center"
                />
            </View>
        );
};

export default Loader;
