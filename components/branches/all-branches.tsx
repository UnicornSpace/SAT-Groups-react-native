// 1. Updated AllBranches.tsx - Enhanced to pass complete data including distance/duration
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type React from "react";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { size } from "react-native-responsive-sizes";
import { useDistanceCalculation } from "@/hooks/use-distance-calc";
import { parseBranchName, sentenceCase } from "@/utils";
import { calculateBasicDistance } from "./helpers/distance-helper";
import { LoactionSkeletonLoader } from "../skeleton/location/location-skeleton";

interface AllBranchesProps {
  branches: any[];
  onBranchClick: (branch: any) => void;
  loading?: boolean;
}

const AllBranches: React.FC<AllBranchesProps> = ({
  branches,
  onBranchClick,
  loading,
}) => {
  const { t } = useTranslation();
  const { userLocation, branchesWithDistance, isCalculating } =
    useDistanceCalculation(branches);

  console.log(
    "AllBranches - branches:",
    branches?.length || 0,
    "branchesWithDistance:",
    branchesWithDistance?.length || 0
  );

  if (!branches || branches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No branch data available</Text>
      </View>
    );
  }

  // Use original branches with basic distance if advanced calculation hasn't completed
  const dataToShow =
    branchesWithDistance.length > 0 ? branchesWithDistance : branches;

  if (loading) {
    return (
      <View style={{ width: "100%" }}>
        <LoactionSkeletonLoader
          width={150}
          height={22}
          style={{ marginBottom: 10 }}
        />
        <View style={{ gap: 15, width: "100%" }}>
          {[1, 2, 3, 4].map((_, index) => (
            <LoactionSkeletonLoader
              key={index}
              width="100%"
              height={hp(12)}
              style={{ borderRadius: 12 }}
            />
          ))}
        </View>
      </View>
    );
  }

  const handleBranchClick = (item: any, index: number) => {
    // Create enhanced branch data with distance and duration
    const enhancedBranchData = {
      ...item,
      // Ensure we have distance and duration data
      calculatedDistance: item.distance || item.calculatedDistance,
      calculatedDuration: item.duration || item.calculatedDuration,
      userLocation: userLocation, // Pass user location for reference
    };

    // If we don't have calculated distance/duration, add basic calculation
    if (!enhancedBranchData.calculatedDistance && 
        userLocation.latitude && userLocation.longitude && 
        item.lat && item.lng) {
      enhancedBranchData.calculatedDistance = calculateBasicDistance(
        userLocation, 
        item.lat, 
        item.lng
      );
      // You might want to add basic duration calculation here too
      // For now, setting a placeholder
      enhancedBranchData.calculatedDuration = "-- min";
    }

    onBranchClick(enhancedBranchData);
  };

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

      {isCalculating && branchesWithDistance.length === 0 && (
        <View style={styles.loadingContainer}>
          <Text>Calculating distances...</Text>
        </View>
      )}

      <View style={styles.branchesContainer}>
        {dataToShow.map((item: any, index: number) => {
          const { branchName } = parseBranchName(
            item.location_name || item.name || "Branch"
          );

          // Use calculated distance or fallback to basic calculation
          let distance = item.distance || "-- KM";
          if (
            !item.distance &&
            userLocation.latitude &&
            userLocation.longitude &&
            item.lat &&
            item.lng
          ) {
            distance = calculateBasicDistance(userLocation, item.lat, item.lng);
          }

          return (
            <TouchableOpacity
              key={item.id || item.location_code || `branch-${index}`}
              style={styles.branchItem}
              onPress={() => handleBranchClick(item, index)}
            >
              <Image
                style={styles.branchImage}
                source={{
                  uri:
                    item.brand_logo ||
                    item.logo ||
                    "https://via.placeholder.com/100",
                }}
                resizeMode="contain"
              />
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>
                  {sentenceCase(branchName)}
                </Text>
                {(item.brand || item.location_code) && (
                  <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                      {item.location_code || item.brand}
                    </Text>
                  </View>
                )}
                <Text style={styles.distanceText}>{distance}</Text>
                {item.duration && (
                  <Text style={styles.durationText}>{item.duration}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AllBranches;

// Add duration text style
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
  },
  branchImage: {
    width: wp("20%"),
    height: hp("10%"),
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
    width: "auto",
    backgroundColor: theme.colors.brand.blue,
    paddingVertical: size(2),
    justifyContent: "center",
    alignItems: "center",
    marginTop: size(4),
    paddingHorizontal: size(8),
  },
  date: {
    fontSize: size(8),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
    textAlign: "center",
  },
  distanceText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: size(12),
    color: theme.colors.text.secondary,
    marginTop: size(4),
  },
  durationText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: size(10),
    color: theme.colors.text.secondary,
    marginTop: size(2),
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: hp(1),
  },
  emptyContainer: {
    width: wp("90%"),
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.fontFamily.medium,
  },
});