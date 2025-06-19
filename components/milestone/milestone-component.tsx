
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { iconPaths } from "@/components/icons";
import { generatePathSegments } from "@/utils";
import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  PanResponder,
} from "react-native";
import { useAuth } from "@/utils/auth-context";
import { router } from "expo-router";
import { getMilestoneData } from "@/api/milestone/milestone-data";
import { claimMilestone } from "@/api/milestone/claim-milestone";
import MilestoneHeader from "./milestone-header";
import MilestoneModal from "./milestone-modal";
import MilestonePath from "./milestone-path";
import { leftPosition, rightPosition, startY, svgWidth, verticalSpacing } from "@/infrastructure/constants/milestone-path-constants";

const MilestoneComponent: React.FC<MilestonePathProps> = ({
  milestones: milestoneData,
  totalPoints: initialTotalPoints,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [visible, setVisible] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Add state for total points and milestones to handle updates
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  useEffect(() => {
    // Initialize total points with the initial value
    setTotalPoints(initialTotalPoints);
    setMilestones(milestoneData);
  }, [initialTotalPoints, milestoneData]);


  // Process milestones based on user points
  const processedMilestones = useMemo(() => {
    return milestones.map((milestone, index) => {
      if (!milestone) {
        console.warn(`Milestone at index ${index} is undefined`);
        return {
          id: `default-${index}`,
          requiredPoints: "0",
          rewardPoints: "0",
          rewardType: "Points" as const,
          status: "unclaimed" as const,
          position: index + 1,
          isAchieved: false,
          isCurrent: false,
        };
      }
      const milestonePoints = Number(milestone.requiredPoints) || 0;
      const isAchieved = totalPoints >= milestonePoints;

      const isNext =
        !isAchieved &&
        (index === 0 ||
          totalPoints >= (Number(milestones[index - 1].requiredPoints) || 0)) &&
        totalPoints < milestonePoints;

      return {
        ...milestone,
        isAchieved,
        isCurrent: isNext,
      };
    });
  }, [totalPoints, milestones]);



  // Calculate coordinates for each milestone
  const calculatePoints = (items: Milestone[]) => {
    const points = [];
    const totalItems = items.length;
    const totalPathHeight = (totalItems - 1) * verticalSpacing;
    let currentY = totalPathHeight + startY;

    for (let index = 0; index < totalItems; index++) {
      const item = items[index];
      const isEven = index % 2 === 0;

      const x =
        index === 0 ? svgWidth / 2 : isEven ? leftPosition : rightPosition;
      const y = currentY - index * verticalSpacing;

      points.push({
        x,
        y,
        label: `${item.requiredPoints} L`,
        points: item.requiredPoints ?? 0,
        isCurrent: item.isCurrent,
        isAchieved: Number(item.requiredPoints) <= totalPoints,
        rewardType: item.rewardType,
        milestone: item,
      });
    }

    return points;
  };

  const points = calculatePoints(processedMilestones);

  const { completedPath, remainingPath } = generatePathSegments(
    points.map((p) => ({ x: p.x, y: p.y, points: Number(p.points) })),
    totalPoints
  );

  const totalPathHeight = (processedMilestones.length - 1) * verticalSpacing;
  const totalSvgHeight = totalPathHeight + startY * 2.2;

  const currentMilestoneIndex = processedMilestones.findIndex(
    (m) => m.isCurrent
  );
  const previousMilestone =
    currentMilestoneIndex > 0
      ? processedMilestones[currentMilestoneIndex - 1]
      : processedMilestones[0] || null;

  const currentMilestone =
    currentMilestoneIndex >= 0
      ? processedMilestones[currentMilestoneIndex]
      : processedMilestones.length > 0
      ? processedMilestones[processedMilestones.length - 1]
      : null;

  const pointsToNextMilestone = currentMilestone
    ? (Number(currentMilestone.requiredPoints) || 0) -
      (Number(previousMilestone?.requiredPoints) || 0)
    : 0;
  const userProgressInSegment = previousMilestone
    ? totalPoints - (Number(previousMilestone.requiredPoints) || 0)
    : totalPoints;
  const progressPercentage =
    pointsToNextMilestone > 0
      ? Math.min(
          100,
          Math.floor((userProgressInSegment / pointsToNextMilestone) * 100)
        )
      : 100;

  useEffect(() => {
    const HEADER_HEIGHT = hp(8);
    if (scrollRef.current && currentMilestoneIndex !== -1) {
      scrollRef.current.scrollTo({
        y:
          (processedMilestones.length - 1 - currentMilestoneIndex) *
          HEADER_HEIGHT,
        animated: true,
      });
    }
  }, [currentMilestoneIndex]);

  const showModal = (milestone: any) => {
    setSelectedMilestone(milestone);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedMilestone(null);
  };

  const handleMilestonePress = (point: any) => {
    // console.log("Pressed milestone:", point);
    showModal(point.milestone);
  };

  const { token, driverId } = useAuth();

  const fetchUserMilestones = async () => {
    try {
      const response = await getMilestoneData(driverId, token);

      if (response.data && response.data.milestones) {
        setMilestones(response.data.milestones);

        // If the API also returns updated total points, you can update that too
        if (response.data.totalPoints !== undefined) {
          setTotalPoints(response.data.totalPoints);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching milestones:", error);
      throw error;
    }
  };

  const handleClaim = async (milestone: Milestone) => {
    console.log("Claiming milestone:✅✅", milestone);
    const milestoneId = milestone.id;
    try {
      const response = await claimMilestone(driverId, token, milestoneId);

      if (response.status !== 200) {
        console.log("Failed to claim milestone");
      }

      await fetchUserMilestones();
      const rewardPoints = Number(milestone.rewardPoints);
      setTotalPoints((prevTotal) => prevTotal + rewardPoints);
      router.reload();
    } catch (error) {
      console.error("Error claiming milestone:", error);
    }

    hideModal();
  };

 
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      // console.log("Touch coordinates:", locationX, locationY);

      // Calculate touch tolerance (responsive)
      const touchTolerance = wp(10);

      const tappedIndex = points.findIndex((point) => {
        const distance = Math.hypot(locationX - point.x, locationY - point.y);
        return distance < touchTolerance;
      });

      if (tappedIndex !== -1) {
        handleMilestonePress(points[tappedIndex]);
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      // Allow scrolling while still detecting taps
      return false;
    },

    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // Handle release if needed
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Handle termination if needed
    },
    onShouldBlockNativeResponder: (evt, gestureState) => false,
  });

  const onRefresh = () => {
    setRefreshing(true);
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <MilestoneHeader totalPoints={totalPoints} milestones={milestones} currentMilestone={currentMilestone} progressPercentage={progressPercentage} />

      {/* Modal */}
      <MilestoneModal visible={visible} hideModal={hideModal} selectedMilestone={selectedMilestone} totalPoints={totalPoints} progressPercentage={progressPercentage} handleClaim={handleClaim} />

      {/* Scrollable Content with PanResponder */}
      <MilestonePath refreshing={refreshing } onRefresh={onRefresh } scrollRef={scrollRef } panResponder={panResponder } svgWidth={svgWidth } totalSvgHeight={totalSvgHeight } completedPath={completedPath } remainingPath={remainingPath } points={points } iconPaths={iconPaths } />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
 
});

export default MilestoneComponent;
