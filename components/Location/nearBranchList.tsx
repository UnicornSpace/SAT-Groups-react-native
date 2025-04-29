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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { getDistance } from "geolib"; // Import geolib to calculate distance
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import LocationIcon from "./locationIcon";

const Branches = ({ data }: any) => {
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

    console.log("User Location:", userLocation);
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

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const { t } = useTranslation();

  if (!data || !Array.isArray(data)) {
    return (
      <View>
        <Text>No branch data available</Text>
      </View>
    );
  }
  const sentenceCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  };
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {data.map((item: any) => {
        const distance = getDistance(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          { latitude: parseFloat(item.lat), longitude: parseFloat(item.lng) }
        );
        const distanceInKm = (distance / 1000).toFixed(1); // Convert distance from meters to kilometers
        return (
          <TouchableOpacity
            key={item.location_code}
            onPress={() => openInGoogleMaps(item.lat, item.lng)}
            style={styles.card}
          >
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {/* <Image
                source={require("@/assets/images/satgroups/LocationLogo.png")}
              /> */}
                <Text
                  style={{
                    fontFamily: theme.fontFamily.medium,
                    fontSize: hp(2),
                  }}
                >
                  {sentenceCase(item.location_name) || t("Branch")}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="map-pin" size={10} color="black" />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.medium,
                      fontSize: hp(1.5),
                      marginBottom: -4,
                      opacity: 0.8,
                    }}
                  >
                    {t(`${distanceInKm} KM`)}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "baseline",
                  }}
                >
                  <MaterialCommunityIcons
                    name="timer-sand-full"
                    size={10}
                    color="black"
                  />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.medium,
                      fontSize: hp(1.6),
                      opacity: 0.8,
                    }}
                  >
                    {t("1 hrs")}
                  </Text>
                </View>
              </View>
            </View>
            <LocationIcon />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const NearBranchList = () => {
  const { t } = useTranslation();
  const [nearBranch, setnearBranch] = useState([]);
  useEffect(() => {
    const driver_id = 2;
    const token =
      "8ef3cf4ed84148e6a5c9faa3267a0acf57f7320703fd7644785a16342a41e7e2";

    const getNearestBranch = async () => {
      try {
        const response = await axiosInstance.get("/get-location.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nearBranches = response.data;
        setnearBranch(nearBranches.data || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getNearestBranch();
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: wp("90%"),
      }}
    >
      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: wp("90%"),
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontFamily: theme.fontFamily.medium,
            color: theme.colors.ui.black,
            textAlign: "center",
          }}
        >
          {t("Nearest Branch")}
        </Text>
      </View> */}
      <Branches data={nearBranch} />
    </View>
  );
};

export default NearBranchList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F3F5",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
    borderLeftWidth: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
  },
});
