import { StyleSheet, View } from "react-native";
import MilestoneComponent from "@/components/milestone/milestone-component";

const milestone = () => {
  const milestoneData = [
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

  const totalPoints = 200;
  const transformedMilestones: Milestone[] = milestoneData.map(
    (item, index) => {
      const points = parseInt(item.requiredPoints);
      const isStart = index === 0 && points === 0;

      return {
        label: isStart ? "START" : `${points} L`,
        points: points,
        isAchieved: false, // Will be calculated in MilestoneComponent
        iconType: item.rewardType === "Gift" ? "gift" : "coins",
      };
    }
  );
  const defaultMilestones: Milestone[] = [
    { label: "START", points: 0, isAchieved: false },
    { label: "1 L", points: 1, isAchieved: false, iconType: "coins" },
    { label: "50 L", points: 50, isAchieved: false, iconType: "coins" },
    { label: "100 L", points: 100, isAchieved: false, iconType: "coins" },
    { label: "200 L", points: 200, isAchieved: false, iconType: "coins" },
    { label: "250 L", points: 250, isAchieved: false, iconType: "coins" },
    { label: "500 L", points: 500, isAchieved: false, iconType: "gift" },
    { label: "550 L", points: 550, isAchieved: false, iconType: "coins" },
    { label: "600 L", points: 600, isAchieved: false, iconType: "coins" },
    { label: "700 L", points: 700, isAchieved: false, iconType: "coins" },
    { label: "750 L", points: 750, isAchieved: false, iconType: "coins" },
    { label: "1000 L", points: 1000, isAchieved: false, iconType: "gift" },
  ];

  console.log("Transformed milestones:", transformedMilestones);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MilestoneComponent
        milestones={transformedMilestones}
        totalPoints={totalPoints}
      />
    </View>
  );
};

export default milestone;

const styles = StyleSheet.create({});

// const { token, isLoading, driverId } = useAuth();

//   // api call
//   useEffect(() => {
//     // Fetch milestones from API if custom milestones are not provided
//     const fetchMilestones = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `/get-user-milestones.php`,
//           {
//             driver_id: driverId,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         console.log("Fetched milestones:", response.data.mileStones);
//         return response.data.milestones || [];
//       } catch (error) {
//         console.error("Error fetching milestones:", error);
//         return [];
//       }
//     };

//     fetchMilestones();
//   }, []);

// import React, { useEffect } from "react";
// import axiosInstance from "@/utils/axionsInstance";
// import { useAuth } from "@/utils/AuthContext";
// const parseMilestoneData = milestoneData.map((item) => ({
//   label: `${item.requiredPoints} L`,
//   points: parseInt(item.requiredPoints, 10),
//   isAchieved: item.requiredPoints <= (totalPoints),
//   iconType: item.rewardType === "Gift" ? "gift" : "coins",
// }));
