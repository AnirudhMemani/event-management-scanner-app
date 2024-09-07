import AsyncStorage from "@react-native-async-storage/async-storage";

// Save token in AsyncStorage
export const setToken = async (tokenKey: string, token: string) => {
  try {
    await AsyncStorage.setItem(tokenKey, token);
  } catch (e) {
    console.error("Error saving token to AsyncStorage:", e);
  }
};

// Get token from AsyncStorage
export const getToken = async (tokenKey: string) => {
  try {
    const token = await AsyncStorage.getItem(tokenKey);
    return token;
  } catch (e) {
    console.error("Error getting token from AsyncStorage:", e);
    return null;
  }
};

// Remove token from AsyncStorage (optional, if you need logout functionality)
export const removeToken = async (tokenKey: string) => {
  try {
    await AsyncStorage.removeItem(tokenKey);
  } catch (e) {
    console.error("Error removing token from AsyncStorage:", e);
  }
};
