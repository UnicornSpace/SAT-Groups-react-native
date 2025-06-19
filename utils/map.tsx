import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export const openInGoogleMaps = async (link: string) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Location Permission Required",
        "Allow location access to use this feature smoothly.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    await Linking.openURL(link);
  } catch (error) {
    console.error("Error opening maps:", error);
    Alert.alert("Error", "Failed to open Google Maps");
  }
};
