import { StyleSheet, View } from "react-native";
import MilestoneComponent from "@/components/milestone/milestone-component";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import axiosInstance from "@/utils/axionsInstance";

const milestone = () => {
  const milestoneData: Milestone[] = [
    {
      id: "1",
      position: 1,
      requiredPoints: "0",
      rewardPoints: "0",
      rewardType: "Points",
      status: "unclaimed",
    },
    {
      id: "2",
      position: 2,
      requiredPoints: "50",
      rewardPoints: "60",
      rewardType: "Points",
      status: "unclaimed",
    },
    {
      id: "3",
      position: 3,
      requiredPoints: "100",
      rewardPoints: "60",
      rewardType: "Points",
      status: "unclaimed",
    },
    {
      id: "4",
      position: 4,
      requiredPoints: "150",
      rewardPoints: "60",
      rewardType: "Points",
      status: "unclaimed",
    },
    {
      id: "5",
      position: 5,
      requiredPoints: "250",
      rewardPoints: "120",
      rewardType: "Points",
      status: "unclaimed",
    },
    {
      id: "6",
      position: 6,
      requiredPoints: "500",
      rewardPoints: "Gift",
      rewardType: "Gift",
      status: "unclaimed",
    },
  ];
  const totalpoints = 40;
  const { token, isLoading, driverId } = useAuth();

  const [data, setData] = useState(milestoneData);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Fetch milestones from API if custom milestones are not provided
    const fetchMilestones = async () => {
      try {
        const response = await axiosInstance.post(
          `/get-user-milestones.php`,
          {
            driver_id: driverId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response from API: --------------👀👀👀👀👀👀👀👀👀\n\n", JSON.parse(JSON.stringify(response.status, null, 2)));
        if(!response.data || !response.data.mileStones || response.status !== 200) {
          console.warn("Invalid response structure or status code, using default data");
          setData(milestoneData); // Use default data
          return;

        }
        console.log("Fetched milestones:✅", response.data);

        // Add validation for the response data
        const fetchedMilestones = response.data.mileStones;
        const fetchedTotalPoints = response.data.totalPoints;
        console.log("Fetched milestones:✅", fetchedTotalPoints);
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

          if (validMilestones.length > 0) {
            setData(validMilestones);
          } else {
            console.warn("No valid milestones found, using default data");
            setData(milestoneData); // Use default data
          }
        } else {
          console.warn("Invalid milestones data received, using default data");
          setData(milestoneData); // Use default data
        }

        // Set total points with validation
        setTotalPoints(
          typeof fetchedTotalPoints === "number" ? fetchedTotalPoints : 0
        );
      } catch (error) {
        console.error("Error fetching milestones:", error);
        // Use default data on error
        setData(milestoneData);
        setTotalPoints(0);
      }
    };

    if (driverId && token) {
      // Only fetch if we have required data
      fetchMilestones();
    }
  }, [driverId, token]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MilestoneComponent milestones={data} totalPoints={totalPoints} />
    </View>
  );
};

export default milestone;

const styles = StyleSheet.create({});

/*

 const transformedMilestones: Milestone[] = milestoneData.map(
    (item, index) => {
      const points = parseInt(item.requiredPoints);
      const isStart = index === 0 && points === 0;

      return {
        label: isStart ? "START" : `${points} L`,
        points: points,
        isAchieved: false, // Will be calculated in MilestoneComponent
        iconType: item.rewardType === "Gift" ? "Gift" : "Points",
      };
    }
  );
*/
//   // api call

// import React, { useEffect } from "react";
// import axiosInstance from "@/utils/axionsInstance";
// import { useAuth } from "@/utils/AuthContext";
// const parseMilestoneData = milestoneData.map((item) => ({
//   label: `${item.requiredPoints} L`,
//   points: parseInt(item.requiredPoints, 10),
//   isAchieved: item.requiredPoints <= (totalPoints),
//   iconType: item.rewardType === "Gift" ? "gift" : "coins",
// }));
