// nearBranchList.tsx
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
import { useAuth } from "@/utils/AuthContext";
import axios from "axios";

const Branches = ({ data }: any) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  const [sortedBranches, setSortedBranches] = useState([]);
  const { t } = useTranslation();


const GOOGLE_API_KEY = "AIzaSyC77ybS7vBhldjja1wO7YiGd5z0jkTHm4I";
  // Get user location
  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } else {
        Alert.alert(
          "Location Permission Required",
          "Allow location access to use this feature smoothly.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    };
    fetchLocation();
  }, []);

  const openInGoogleMaps = async (link: string) => {
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

    Linking.openURL(link);
  };


  // Fetch distances from Google API
  useEffect(()=>{
    const fetchdata = async ()=>{
      try{
        const destinations = data.map((loc:any)=>`${parseFloat(loc.lat)},${parseFloat(loc.lng)}`).join("|");
        const origin = `${userLocation.latitude},${userLocation.longitude}`;
         const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&mode=driving&key=${GOOGLE_API_KEY}`;
           const res = await axios.get(url);
           console.log("Sorted 😂😂:", url);
        const results = res.data.rows[0].elements;
console.log("Sorted 😂😂:", res);
        const enriched = data.map((loc: any, i: number) => ({
          ...loc,
          distance: results[i].distance?.text || "",
          duration: results[i].duration?.text || "",
          distanceValue: results[i].distance?.value || 9999999,
        }));

        const sorted = enriched.sort((a, b) => a.distanceValue - b.distanceValue);

        setSortedBranches(sorted);
      }
      catch(err){
        console.error("Failed to fetch distances:", err);
      }
    }
    if (userLocation.latitude && userLocation.longitude && data.length > 0) {
      fetchdata();
    }
  },[userLocation, data])

console.log("Sorted Branches😂😂:", sortedBranches);
  //  Data handling
  if (!data || !Array.isArray(data)) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No branch data available</Text>
      </View>
    );
  }

  // Helper function to convert string to sentence case
  const sentenceCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  };

  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {sortedBranches.map((item: any) => {
        return (
          <TouchableOpacity
            key={item.location_code}
            onPress={() => openInGoogleMaps(item.google_map_link)}
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
                <Text
                  style={{
                    fontFamily: theme.fontFamily.semiBold,
                    fontSize: hp(2),
                    color: theme.colors.brand.blue,
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
                    {item.distance || "N/A"} KM
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
                    {item.duration || t("N/A")}
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
  const [nearBranch, setNearBranch] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const getNearestBranch = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/get-location.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nearBranches = response.data;
        setNearBranch(nearBranches.data || []);
      } catch (error) {
        console.error("Error fetching branch details:", error);
        Alert.alert("Error", "Failed to load branch information");
      } finally {
        setIsLoading(false);
      }
    };

    getNearestBranch();
  }, [token]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: wp("90%"),
      }}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading branches...</Text>
        </View>
      ) : (
        <Branches data={nearBranch} />
      )}
    </View>
  );
};

export default NearBranchList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F3F5",
    // boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
    borderLeftWidth: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    elevation: 2.5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: hp(3),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: hp(3),
  },
});
