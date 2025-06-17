"use client";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { iconPaths } from "@/components/icons";
import { theme } from "@/infrastructure/themes";
import { generatePathSegments } from "@/utils";
import { t } from "i18next";
import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ImageBackground,
  Text as RNText,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import Svg, { Path, Circle, Text, G, SvgUri, Rect } from "react-native-svg";
import axiosInstance from "@/utils/axionsInstance";
import { useAuth } from "@/utils/AuthContext";

const MilestoneComponent: React.FC<MilestonePathProps> = ({
  milestones: milestoneData,
  totalPoints: initialTotalPoints,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [visible, setVisible] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  // Add state for total points and milestones to handle updates
  const [totalPoints, setTotalPoints] = useState(initialTotalPoints);
  const [milestones, setMilestones] = useState(milestoneData);

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



  // SVG dimensions and spacing
  const svgWidth = 300;
  const verticalSpacing = 120;
  const leftPosition = 60;
  const rightPosition = 240;
  const startY = 15;

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
    points.map((p) => ({ x: p.x, y: p.y, points: Number(p.points) || 0 })),
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
    console.log("Pressed milestone:", point);
    showModal(point.milestone);
  };

  const { token, driverId } = useAuth();

  const handleClaim = async (milestone: Milestone) => {
    console.log("Claiming milestone:", milestone);

    try {
      const response = await axiosInstance.post(
        "/claim-user-milestones.php",
        {
          driver_id: driverId,
          mileStoneId: milestone.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Claim response:", response.data);

      // Update the milestone status to claimed
      setMilestones((prevMilestones) =>
        prevMilestones.map((m) =>
          m.id === milestone.id ? { ...m, status: "claimed" as const } : m
        )
      );

      // Add reward points to total points
      const rewardPoints = Number(milestone.rewardPoints) || 0;
      setTotalPoints((prevTotal) => prevTotal + rewardPoints);

      console.log(
        `Added ${rewardPoints} reward points. New total: ${
          totalPoints + rewardPoints
        }`
      );
    } catch (error) {
      console.error("Error claiming milestone:", error);
      // You might want to show an error message to the user here
    }

    hideModal();
  };

  // Fixed PanResponder implementation
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      console.log("Touch coordinates:", locationX, locationY);

      // Calculate touch tolerance (responsive)
      const touchTolerance = wp(10);

      const tappedIndex = points.findIndex((point) => {
        const distance = Math.hypot(locationX - point.x, locationY - point.y);
        console.log(
          `Point ${point.points}L - Distance: ${distance}, Tolerance: ${touchTolerance}`
        );
        return distance < touchTolerance;
      });

      console.log("Tapped index:", tappedIndex);

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

  return (
    <View style={styles.container}>
      {/* Fixed Progress Container */}
      <View style={styles.fixedProgressContainer}>
        <View style={styles.progressCard}>
          <RNText style={styles.pointsText}>
            {t("Your Points")}: {totalPoints}
          </RNText>
          <View style={styles.nextMilestoneContainer}>
            <RNText style={styles.milestoneText}>
              {totalPoints >=
              (Number(milestones[milestones.length - 1]?.requiredPoints) || 0)
                ? t("All milestones achieved")
                : currentMilestone
                ? `${progressPercentage}% to ${currentMilestone.requiredPoints} L`
                : "Loading milestones..."}
            </RNText>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <RNText style={styles.modalTitle}>Milestone Details</RNText>
            <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
              <RNText style={styles.closeButtonText}>×</RNText>
            </TouchableOpacity>
          </View>

          {selectedMilestone && (
            <View style={styles.modalBody}>
              <View style={styles.milestoneInfoCard}>
                <RNText style={styles.milestonePointsText}>
                  {selectedMilestone.requiredPoints} Points Required
                </RNText>

                <View style={styles.rewardSection}>
                  <RNText style={styles.rewardLabel}>Reward:</RNText>
                  <RNText style={styles.rewardText}>
                    {selectedMilestone.rewardType === "Gift"
                      ? "🎁 Special Gift"
                      : `${selectedMilestone.rewardPoints} Points`}
                  </RNText>
                </View>

                <View style={styles.statusSection}>
                  <RNText style={styles.statusLabel}>Status:</RNText>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: selectedMilestone.isAchieved
                          ? "#4CAF50"
                          : selectedMilestone.isCurrent
                          ? "#FF9800"
                          : "#9E9E9E",
                      },
                    ]}
                  >
                    <RNText style={styles.statusText}>
                      {selectedMilestone.isAchieved
                        ? "Achieved"
                        : selectedMilestone.isCurrent
                        ? "In Progress"
                        : "Locked"}
                    </RNText>
                  </View>
                </View>

                {selectedMilestone.isCurrent && (
                  <View style={styles.progressSection}>
                    <RNText style={styles.progressLabel}>
                      Progress: {totalPoints} /{" "}
                      {selectedMilestone.requiredPoints}
                    </RNText>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${progressPercentage}%` },
                        ]}
                      />
                    </View>
                    <RNText style={styles.progressPercentage}>
                      {progressPercentage}% Complete
                    </RNText>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      selectedMilestone.isAchieved &&
                      selectedMilestone.status === "unclaimed"
                        ? "#4CAF50"
                        : "#ccc",
                  },
                ]}
                disabled={
                  !selectedMilestone.isAchieved ||
                  selectedMilestone.status === "claimed"
                }
                onPress={() => {
                  if (
                    selectedMilestone.isAchieved &&
                    selectedMilestone.status === "unclaimed"
                  ) {
                    handleClaim(selectedMilestone);
                  }
                }}
              >
                <RNText
                  style={[
                    styles.actionButtonText,
                    {
                      color:
                        selectedMilestone.isAchieved &&
                        selectedMilestone.status === "unclaimed"
                          ? "white"
                          : "#666",
                    },
                  ]}
                >
                  
                  {selectedMilestone.status === "claimed"
                    ? "Already Claimed"
                    : selectedMilestone.isAchieved
                    ? "Claim Reward"
                    : "Not Available"}
                </RNText>
              </TouchableOpacity>
            </View>
          )}
        </Modal>
      </Portal>

      {/* Scrollable Content with PanResponder */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
        // Remove panHandlers from ScrollView to prevent conflicts
      >
        <View
          style={styles.svgContainer}
          {...panResponder.panHandlers} // Apply panHandlers to the SVG container instead
        >
          <ImageBackground
            opacity={0.3}
            source={require("@/assets/images/satgroups/tile_background.png")}
            resizeMode="cover"
            style={styles.backgroundImage}
          >
            <Svg
              width={svgWidth}
              height={totalSvgHeight}
              viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
            >
              <G>
                {completedPath && (
                  <Path
                    stroke="#26456C"
                    strokeLinecap="square"
                    strokeWidth={wp(8)}
                    d={completedPath}
                  />
                )}

                {remainingPath && (
                  <Path
                    stroke="#DBDBDB"
                    strokeLinecap="square"
                    strokeWidth={wp(8)}
                    d={remainingPath}
                  />
                )}

                {points.map((point, index) => {
                  const isStart = index === 0;
                  const circleRadius = isStart ? wp(10) : wp(6);
                  const labelOffset = isStart ? wp(1.5) : wp(9);
                  const isEven = index % 2 === 0;

                  const labelX = isStart
                    ? point.x
                    : isEven && !isStart
                    ? point.x - wp(2.5)
                    : point.x + wp(2.5);

                  return (
                    <React.Fragment key={index}>
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={circleRadius}
                        fill={
                          point.isAchieved
                            ? "#26456C"
                            : isStart
                            ? "#26456C"
                            : point.isCurrent
                            ? "#fff"
                            : "#DBDBDB"
                        }
                        stroke={
                          isStart
                            ? "#fff"
                            : point.isCurrent
                            ? "#26456C"
                            : "#fff"
                        }
                        strokeWidth={point.isCurrent ? wp(1.5) : wp(0.8)}
                      />

                      {point.rewardType && (
                        <G
                          transform={`translate(${point.x - wp(2.5)}, ${
                            point.y - wp(2.5)
                          }) scale(${wp(0.2)})`}
                          fill={
                            point.isAchieved || isStart
                              ? "#fff"
                              : point.isCurrent
                              ? "#26456C"
                              : "#fff"
                          }
                        >
                          {isStart ? " " : <Path d={iconPaths[point.rewardType]} />}
                        </G>
                      )}

                      <Text
                        x={
                          isStart? point.x
                            : isEven && !isStart
                            ? labelX - wp(2.5)
                            : labelX + wp(2.5)
                            
                        }
                        y={point.y + labelOffset}
                        fill={isStart ? "#fff" : "#26456C"}
                        fontFamily={
                          isStart
                            ? theme.fontFamily.bold
                            : theme.fontFamily.regular
                        }
                        fontSize={isStart ? wp(4) : wp(4)}
                        textAnchor={
                          isStart
                            ? "middle"
                            : isEven && !isStart
                            ? "end"
                            : "start"
                        }
                      >
                        {isStart ? "START" : point.points + " L"}
                      </Text>
                    </React.Fragment>
                  );
                })}
              </G>
            </Svg>
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: hp(20),
  },
  svgContainer: {
    flex: 1,
    minHeight: hp(100), // Ensure minimum height for proper touch handling
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    minHeight: hp(100),
  },
  // Modal Styles
  modalContent: {
    backgroundColor: "white",
    margin: wp(5),
    borderRadius: wp(3),
    maxHeight: hp(80),
    elevation: 5,
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: wp(5),
    color: "#26456C",
    fontFamily: theme.fontFamily.bold,
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: wp(5),
    color: "#666",
    fontFamily: theme.fontFamily.bold,
  },
  modalBody: {
    padding: wp(5),
  },
  milestoneInfoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: wp(5),
  },
  milestonePointsText: {
    fontSize: wp(6),
fontFamily: theme.fontFamily.semiBold,
    color: "#26456C",
    textAlign: "center",
    marginBottom: wp(4),
  },
  rewardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: wp(3),
  },
  rewardLabel: {
    fontSize: wp(4),
    color: "#666",
    fontFamily: theme.fontFamily.medium,
  },
  rewardText: {
    fontSize: wp(4),
    color: "#26456C",
    fontFamily: theme.fontFamily.semiBold,

  },
  statusSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: wp(4),
  },
  statusLabel: {
    fontSize: wp(4),
    color: "#666",
    fontFamily: theme.fontFamily.medium,
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(3),
  },
  statusText: {
    color: "white",
    fontSize: wp(3.2),
    fontFamily: theme.fontFamily.semiBold,
  },
  progressSection: {
    marginTop: wp(4),
  },
  progressLabel: {
    fontSize: wp(3.5),
    color: "#666",
    marginBottom: wp(2),
    fontFamily: theme.fontFamily.medium,
  },
  progressBarContainer: {
    height: wp(2),
    backgroundColor: "#e0e0e0",
    borderRadius: wp(1),
    overflow: "hidden",
    marginBottom: wp(2),
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#26456C",
    borderRadius: wp(1),
  },
  progressPercentage: {
    fontSize: wp(3),
    color: "#26456C",
    textAlign: "right",
    fontFamily: theme.fontFamily.bold,
  },
  actionButton: {
    padding: wp(4),
    borderRadius: wp(2),
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: wp(4),
    fontFamily: theme.fontFamily.bold,
  },
  fixedProgressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingTop: hp(1.5),
    paddingBottom: hp(1.5),
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  progressCard: {
    padding: wp(4),
    backgroundColor: "#f5f5f5",
    borderRadius: wp(2),
    marginHorizontal: wp(4),
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsText: {
    fontSize: wp(4.8),
    color: "#26456C",
    // marginBottom: wp(2),
    fontFamily: theme.fontFamily.semiBold,
  },
  nextMilestoneContainer: {
    marginTop: wp(2),
  },
  milestoneText: {
    fontSize: wp(3.5),
    // color: "#666",
    marginBottom: wp(1),
    fontFamily: theme.fontFamily.light,
  },
});

export default MilestoneComponent;
