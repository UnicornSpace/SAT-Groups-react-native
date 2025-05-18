import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/infrastructure/themes";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { size } from "react-native-responsive-sizes";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { getDistance } from "geolib";

const AllBranches = ({ branch }: any) => {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  // Get user location
  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    };
    fetchLocation();
  }, []);

  const openInGoogleMaps = async (lat: string, lng: string) => {
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

    // Clean coordinates from any spaces or extra characters
    const cleanLat = parseFloat(lat.replace(/[^0-9.-]/g, ""));
    const cleanLng = parseFloat(lng.replace(/[^0-9.-]/g, ""));

    if (isNaN(cleanLat) || isNaN(cleanLng)) {
      Alert.alert("Error", "Invalid location coordinates");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${cleanLat},${cleanLng}`;
    Linking.openURL(url);
  };

  const sentenceCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  };

  // Calculate distance between user and branch
  const calculateDistance = (branchLat: string, branchLng: string): string => {
    if (!userLocation.latitude || !userLocation.longitude) return "-- KM";

    const cleanLat = parseFloat(branchLat.replace(/[^0-9.-]/g, ""));
    const cleanLng = parseFloat(branchLng.replace(/[^0-9.-]/g, ""));

    if (isNaN(cleanLat) || isNaN(cleanLng)) return "-- KM";

    const distance = getDistance(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      { latitude: cleanLat, longitude: cleanLng }
    );

    return `${(distance / 1000).toFixed(1)} KM`;
  };

  if (!branch || branch.length === 0) {
    return (
      <View style={{ width: wp("90%"), alignItems: "center", padding: 20 }}>
        <Text>No branch data available</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: wp("90%"),
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Text
        style={{
          fontSize: theme.fontSize.medium,
          fontFamily: theme.fontFamily.medium,
          color: theme.colors.ui.black,
        }}
      >
        {t("All Branch")}
      </Text>
      <View style={styles.branchesContainer}>
        {branch.map((item: any) => {
          const locationName = item.location_name.split("-");
          const branchName = locationName[0] || "";
          const branchLocation = locationName[1] || "";
          const distance = calculateDistance(item.lat, item.lng);

          return (
            <TouchableOpacity
              key={item.id || item.location_code}
              style={styles.branchItem}
              onPress={() => openInGoogleMaps(item.lat, item.lng)}
            >
              <Image
                style={styles.branchImage}
                source={require("@/assets/images/satgroups/branch.png")}
              />
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>
                  {sentenceCase(branchName)}
                </Text>
                {branchLocation && (
                  <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                      {t(sentenceCase(branchLocation))}
                    </Text>
                  </View>
                )}
                <Text style={styles.distanceText}>{distance}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AllBranches;

const styles = StyleSheet.create({
  branchesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    gap: hp(2),
  },
  branchItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: wp("43%"),
    backgroundColor: theme.colors.ui.cardbg,
    borderRadius: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // elevation: 1,
  },
  branchImage: {
    width: wp("25%"),
    height: hp("12%"),
    borderRadius: 100,
    marginBottom: 8,
  },
  branchInfo: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  branchName: {
    fontFamily: theme.fontFamily.semiBold,
    fontSize: size(14),
    color: theme.colors.brand.blue,
    textAlign: "center",
    lineHeight: 20,
  },
  dateContainer: {
    borderRadius: 5,
    width: size(50),
    backgroundColor: theme.colors.brand.blue,
    paddingVertical: size(2),
    justifyContent: "center",
    alignItems: "center",
    marginTop: size(4),
  },
  date: {
    fontSize: size(8),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  distanceText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: size(12),
    color: theme.colors.text.secondary,
    marginTop: size(4),
  },
});
