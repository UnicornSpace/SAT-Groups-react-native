
"use client";

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

const MilestoneComponent: React.FC<MilestonePathProps> = ({
  milestones: milestoneData,
  totalPoints,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [visible, setVisible] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  // Process milestones based on user points
  const processedMilestones = useMemo(() => {
    return milestoneData.map((milestone, index) => {
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
          totalPoints >=
            (Number(milestoneData[index - 1].requiredPoints) || 0)) &&
        totalPoints < milestonePoints;

      return {
        ...milestone,
        isAchieved,
        isCurrent: isNext,
      };
    });
  }, [totalPoints, milestoneData]);

  // SVG dimensions and spacing
  const svgWidth = 300;
  const verticalSpacing = 100;
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
        milestone: item, // Store the full milestone data
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
    if (scrollRef.current && currentMilestoneIndex !== -1) {
      scrollRef.current.scrollTo({
        y:
          (processedMilestones.length - 1 - currentMilestoneIndex) *
          verticalSpacing,
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
    console.log("Pressed milestone:♥️", point);
    showModal(point.milestone);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const tappedIndex = points.findIndex(
        (point) => Math.hypot(locationX - point.x, locationY - point.y) < 30
      );
      if (tappedIndex !== -1) {
        handleMilestonePress(points[tappedIndex]);
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.fixedProgressContainer}>
        <View style={styles.progressCard}>
          <RNText style={styles.pointsText}>
            {t("Your Points")}: {totalPoints}
          </RNText>
          <View style={styles.nextMilestoneContainer}>
            <RNText style={styles.milestoneText}>
              {totalPoints >=
              (Number(
                milestoneData[milestoneData.length - 1]?.requiredPoints
              ) || 0)
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
                    // Handle claim reward logic here
                    console.log(
                      "Claiming reward for milestone:",
                      selectedMilestone.id
                    );
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

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.topPadding} />

        <View style={{ height: totalSvgHeight }} {...panResponder.panHandlers}>
          <ImageBackground
            opacity={0.3}
            source={require("@/assets/images/satgroups/tile_background.png")}
            resizeMode="cover"
            style={styles.backgroundImage}
          >
            <Svg
              fill="none"
              height={totalSvgHeight}
              viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
            >
              <G>
                {completedPath && (
                  <Path
                    stroke="#26456C"
                    strokeLinecap="square"
                    strokeWidth={30}
                    d={completedPath}
                  />
                )}

                {remainingPath && (
                  <Path
                    stroke="#DBDBDB"
                    strokeLinecap="square"
                    strokeWidth={30}
                    d={remainingPath}
                  />
                )}

                {points.map((point, index) => {
                  const isStart = index === 0;
                  const circleRadius = isStart ? 38 : 25;
                  const labelOffset = isStart ? 5 : 35;
                  const isEven = index % 2 === 0;

                  const labelX = isStart
                    ? point.x
                    : isEven && !isStart
                    ? point.x - 10
                    : point.x + 10;

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
                        strokeWidth={point.isCurrent ? 5 : 3}
                      />

                      {point.rewardType && (
                        <G
                          transform={`translate(${point.x - 10}, ${
                            point.y - 10
                          }) scale(0.8)`}
                          fill={
                            point.isAchieved || isStart
                              ? "#fff"
                              : point.isCurrent
                              ? "#26456C"
                              : "#fff"
                          }
                        >
                          <Path d={iconPaths[point.rewardType]} />
                        </G>
                      )}

                      <Text
                        x={labelX}
                        y={point.y + labelOffset}
                        fill={isStart ? "#fff" : "#26456C"}
                        fontFamily={
                          isStart
                            ? theme.fontFamily.bold
                            : theme.fontFamily.regular
                        }
                        fontSize={isStart ? 14 : 12}
                        textAnchor={
                          isStart
                            ? "middle"
                            : isEven && !isStart
                            ? "end"
                            : "start"
                        }
                      >
                        {point.points} L
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
  scrollContainer: {
    flexGrow: 1,
  },
  topPadding: {
    height: 50,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  // Modal Styles
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#26456C",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  modalBody: {
    padding: 20,
  },
  milestoneInfoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  milestonePointsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#26456C",
    textAlign: "center",
    marginBottom: 16,
  },
  rewardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rewardLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  rewardText: {
    fontSize: 16,
    color: "#26456C",
    fontWeight: "bold",
  },
  statusSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressSection: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#26456C",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: "#26456C",
    textAlign: "right",
    fontWeight: "bold",
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
   fixedProgressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
   progressCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#26456C",
    marginBottom: 8,
    fontFamily: theme.fontFamily.regular,
  },
   nextMilestoneContainer: {
    marginTop: 8,
  },
  milestoneText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: theme.fontFamily.light,
  },
});

export default MilestoneComponent;
