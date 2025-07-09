import MilestoneComponent from "@/components/milestone/milestone-component";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/auth-context";
import { getMilestoneData } from "@/api/milestone/milestone-data";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";

const milestone = () => {
  const { token, driverId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState([]);
 const [totalLitres, setTotalLitres] = useState<number>(0);

  const [isloading, setisloading] = useState(true);
  const fetchMilestones = async () => {
    try {
      const response = await getMilestoneData(driverId, token);

      if (
        !response.data ||
        !response.data.mileStones ||
        response.status !== 200
      ) {
        setError("error fetching milestones");
        return;
      }
      const fetchedMilestones = response.data.mileStones;
      const fetchedTotalPoints = response.data.totalLitres;
      console.log("Fetched milestones🏅:", response.data);
      console.log("Points❌:", fetchedTotalPoints);
      // Validate that milestones is an array and has valid data
      if (Array.isArray(fetchedMilestones) && fetchedMilestones.length > 0) {
        // Validate each milestone has required properties
        const validMilestones = fetchedMilestones.filter(
          (milestone) =>
            milestone &&
            milestone.hasOwnProperty("requiredPoints") &&
            milestone.requiredPoints !== undefined &&
            milestone.requiredPoints !== null
        );
        setisloading(false);
        if (validMilestones.length > 0) {
          setData(validMilestones);
        } else {
          console.warn("No valid milestones found");
          setError("No valid milestones found");
        }
      } else {
        setError("Invalid milestones data format");
      }

      // Set total points with validation
      setTotalLitres(
        typeof fetchedTotalPoints === "number"
          ? fetchedTotalPoints
          : Number(fetchedTotalPoints) || 0
      );
    } catch (error) {
      console.error("Error fetching milestones:", error);
      // Use default data on error
      setData(data);
      setTotalLitres(0);
    }
  };
  useEffect(() => {
    if (driverId && token) {
      // Only fetch if we have required data
      fetchMilestones();
    }
  }, [driverId, token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMilestones(); // Automatically refetch on tab focus
    }, [])
  );
  // console.log("Milestone data:", JSON.stringify(data, null, 2));
  return isloading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} color="#000" />
    </View>
  ) : (
    <MilestoneComponent milestones={data} totalPoints={totalLitres} />
  );
};

export default milestone;
