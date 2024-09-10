/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
    light: {
        text: "#11181C",
        background: "#fff",
        tint: tintColorLight,
        icon: "#687076",
        tabIconDefault: "#687076",
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: "#ECEDEE",
        background: "#151718",
        tint: tintColorDark,
        icon: "#9BA1A6",
        tabIconDefault: "#9BA1A6",
        tabIconSelected: tintColorDark,
    },
};

export enum globalColors {
    green = "#037F01",
    gray = "#4E5549",
    white = "#FFFFFF",
    black = "#000000",
    label = "#666666",
    LIGHT_GRAY = "#DCDDDF",
    DRAWER_ACTIVE = "#007f00",
    TRANSPARENT = "transparent",
    TRUCK_NOTE_TEXT = "#333333",
    JOB_DETAIL_BG_1 = "#F5F5F5",
    JOB_DETAIL_BG_2 = "#E8E8E8",
    JOB_DETAILS_DATE = "#858C91",
    PLACEHOLDER = "#BCBCBC",
    ITEM_DETAILS_HEADER_BG = "#D9EDF7",
}
