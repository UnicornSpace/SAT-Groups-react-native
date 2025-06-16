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

  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ; // Fixed env var name


  // Get user location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced, // Added accuracy setting
          });
          console.log("User location:", location.coords); // Debug log
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
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Failed to get current location");
      }
    };
    fetchLocation();
  }, []);

  const openInGoogleMaps = async (link: string) => {
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

  // Fetch distances from Google API
  useEffect(() => {
    const fetchDistances = async () => {
      // Check if we have required data
      if (!userLocation.latitude || !userLocation.longitude || !data || data.length === 0) {
        console.log("Missing required data for distance calculation:", {
          hasUserLocation: !!(userLocation.latitude && userLocation.longitude),
          hasData: !!(data && data.length > 0),
          dataLength: data?.length || 0
        });
        return;
      }

      try {
        console.log("Fetching distances for", data.length, "branches");
        
        // Validate branch data has required coordinates
        const validBranches = data.filter((loc: any) => 
          loc.lat && loc.lng && 
          !isNaN(parseFloat(loc.lat)) && 
          !isNaN(parseFloat(loc.lng))
        );

        if (validBranches.length === 0) {
          console.error("No valid branch coordinates found");
          setSortedBranches(data); // Set original data if no valid coordinates
          return;
        }

        const destinations = validBranches
          .map((loc: any) => `${parseFloat(loc.lat)},${parseFloat(loc.lng)}`)
          .join("|");
        
        const origin = `${userLocation.latitude},${userLocation.longitude}`;
        
        // Check if Google API key is available
        if (!GOOGLE_API_KEY) {
          console.warn("Google API key not found, using fallback distance calculation");
          // Fallback to geolib for distance calculation
          const enrichedWithGeolib = validBranches.map((loc: any) => {
            const distance = getDistance(
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: parseFloat(loc.lat), longitude: parseFloat(loc.lng) }
            );
            // Estimate duration based on distance (assuming average speed of 40 km/h in city)
            const estimatedDurationMinutes = Math.round((distance / 1000) * 1.5); // 1.5 minutes per km
            const estimatedDuration = estimatedDurationMinutes > 60 
              ? `${Math.floor(estimatedDurationMinutes / 60)}h ${estimatedDurationMinutes % 60}m`
              : `${estimatedDurationMinutes} min`;
            
            return {
              ...loc,
              distance: `${(distance / 1000).toFixed(1)} km`,
              duration: estimatedDuration,
              distanceValue: distance,
            };
          });
          
          const sorted = enrichedWithGeolib.sort(
            (a, b) => a.distanceValue - b.distanceValue
          );
          setSortedBranches(sorted);
          return;
        }

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&mode=driving&units=metric&key=${GOOGLE_API_KEY}`;
        
        console.log("Distance Matrix API URL:", url.replace(GOOGLE_API_KEY, 'API_KEY_HIDDEN'));
        
        const response = await axios.get(url);
        console.log("Distance Matrix API Response:", response.data);

        if (response.data.status !== 'OK') {
          console.error("Google API error:", response.data.status, response.data.error_message);
          throw new Error(`Google API error: ${response.data.status}`);
        }

        const results = response.data.rows[0]?.elements;
        
        if (!results) {
          console.error("No results from Distance Matrix API");
          setSortedBranches(validBranches);
          return;
        }

        const enriched = validBranches.map((loc: any, i: number) => {
          const result = results[i];
          console.log(`Branch ${i} (${loc.location_name}):`, result);
          
          // Check if the result is OK
          if (result?.status === 'OK') {
            return {
              ...loc,
              distance: result.distance?.text || "Loading...",
              duration: result.duration?.text || "Loading...",
              distanceValue: result.distance?.value || 9999999,
            };
          } else {
            console.warn(`No route found for branch ${i}:`, result?.status);
            // Fallback to geolib calculation for this branch
            const distance = getDistance(
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: parseFloat(loc.lat), longitude: parseFloat(loc.lng) }
            );
            const estimatedDurationMinutes = Math.round((distance / 1000) * 1.5);
            const estimatedDuration = estimatedDurationMinutes > 60 
              ? `${Math.floor(estimatedDurationMinutes / 60)}h ${estimatedDurationMinutes % 60}m`
              : `${estimatedDurationMinutes} min`;
            
            return {
              ...loc,
              distance: `${(distance / 1000).toFixed(1)} km`,
              duration: estimatedDuration,
              distanceValue: distance,
            };
          }
        });

        const sorted = enriched.sort(
          (a, b) => a.distanceValue - b.distanceValue
        );

        console.log("Sorted branches:", sorted.length);
        setSortedBranches(sorted);
      } catch (error) {
        console.error("Failed to fetch distances:", error);
        // Fallback to original data without distances
        setSortedBranches(data);
        // Alert.alert("Warning", "Could not calculate distances to branches");
      }
    };

    fetchDistances();
  }, [userLocation, data, GOOGLE_API_KEY]);

  console.log("Branches component - data:", data?.length || 0, "sortedBranches:", sortedBranches.length);

  // Data handling
  if (!data || !Array.isArray(data)) {
    console.log("No branch data available");
    return (
      <View style={styles.emptyContainer}>
        <Text>No branch data available</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No branches found</Text>
      </View>
    );
  }

  // Helper function to convert string to sentence case
  const sentenceCase = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  };

  // Use sortedBranches if available, otherwise use original data
  // Limit to first 3 branches based on distance
  const branchesToShow = sortedBranches.length > 0 
    ? sortedBranches.slice(0, 3) 
    : data.slice(0, 3);

  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {branchesToShow.map((item: any, index: number) => {
        return (
          <TouchableOpacity
            key={item.location_code || `branch-${index}`} // Fallback key
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
                    {item.distance || "Loading..."}
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
                    {item.duration || t("Loading...")}
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
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const getNearestBranch = async () => {
      if (!token) {
        console.log("No auth token available");
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching branch data...");
        const response = await axiosInstance.get("/get-location.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("API Response:", response.data);
        
        const nearBranches = response.data;
        
        // Handle different response structures
        let branchData = [];
        if (nearBranches?.data && Array.isArray(nearBranches.data)) {
          branchData = nearBranches.data;
        } else if (Array.isArray(nearBranches)) {
          branchData = nearBranches;
        } else {
          console.error("Unexpected response structure:", nearBranches);
        }
        
        console.log("Setting branch data:", branchData.length, "branches");
        setNearBranch(branchData);
      } catch (error: any) {
        console.error("Error fetching branch details:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to load branch information";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    getNearestBranch();
  }, [token]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          onPress={() => {
            setError(null);
            setIsLoading(true);
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
    borderLeftWidth: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.3),
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
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: hp(3),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: theme.colors.brand.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});