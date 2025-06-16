"use client";

import { iconPaths } from "@/components/icons";
import { theme } from "@/infrastructure/themes";
import { generatePathSegments } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ImageBackground,
  Text as RNText,
  TouchableOpacity,
} from "react-native";
import Svg, { Path, Circle, Text, G } from "react-native-svg";

const MilestoneComponent: React.FC<MilestonePathProps> = ({
  milestones: milestoneData,
  totalPoints,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  // Process milestones based on user points
  const processedMilestones = useMemo(() => {
    return milestoneData.map((milestone, index) => {
      const milestonePoints = milestone.points ?? 0;
      const isAchieved = totalPoints >= milestonePoints;

      // Find the next unachieved milestone
      const isNext =
        !isAchieved &&
        (index === 0 ||
          totalPoints >= (milestoneData[index - 1].points ?? 0)) &&
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
  const startY = 15; // Starting position (will be adjusted by total height calculation)

  // Calculate coordinates for each milestone
  const calculatePoints = (items: Milestone[]) => {
    const points = [];
    const totalItems = items.length;

    // Determine total path height based on number of milestones
    const totalPathHeight = (totalItems - 1) * verticalSpacing;
    let currentY = totalPathHeight + startY; // Start from bottom

    for (let index = 0; index < totalItems; index++) {
      const item = items[index];
      const isEven = index % 2 === 0;

      // First point is centered, others alternate left and right
      const x =
        index === 0 ? svgWidth / 2 : isEven ? leftPosition : rightPosition;
      const y = currentY - index * verticalSpacing; // Move up for each point

      points.push({
        x,
        y,
        label: `${item.points} L`,
        points: item.points ?? 0,
        isCurrent: item.isCurrent,
        isAchieved: item.isAchieved,
        iconType: item.iconType,
      });
    }

    return points;
  };

  // Get dynamic points
  const points = calculatePoints(processedMilestones);

  // Generate path segments based on user progress
  const { completedPath, remainingPath } = generatePathSegments(
    points.map((p) => ({ x: p.x, y: p.y, points: p.points || 0 })),
    totalPoints
  );

  // Calculate the SVG height based on the number of milestones
  const totalPathHeight = (processedMilestones.length - 1) * verticalSpacing;
  const totalSvgHeight = totalPathHeight + startY * 2; // Add padding for top and bottom

  // Find current milestone for displaying progress
  const currentMilestoneIndex = processedMilestones.findIndex(
    (m) => m.isCurrent
  );
  const previousMilestone =
    currentMilestoneIndex > 0
      ? processedMilestones[currentMilestoneIndex - 1]
      : processedMilestones[0];

  const currentMilestone =
    currentMilestoneIndex >= 0
      ? processedMilestones[currentMilestoneIndex]
      : processedMilestones[processedMilestones.length - 1];

  // Calculate progress percentage
  const pointsToNextMilestone =
    (currentMilestone.points ?? 0) - (previousMilestone.points ?? 0);
  const userProgressInSegment = totalPoints - (previousMilestone.points ?? 0);
  const progressPercentage =
    pointsToNextMilestone > 0
      ? Math.min(
          100,
          Math.floor((userProgressInSegment / pointsToNextMilestone) * 100)
        )
      : 100;

  useEffect(() => {
    // Scroll to the bottom initially to show the start point
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fixed Progress Card at Top */}
      {/* <View style={styles.fixedProgressContainer}>
        <View style={styles.progressCard}>
          <RNText style={styles.pointsText}>
            {t("Your Points")}: {totalPoints}
          </RNText>
          <View style={styles.nextMilestoneContainer}>
            <RNText style={styles.milestoneText}>
              {totalPoints >=
              (milestoneData[milestoneData.length - 1].points ?? 0)
                ? t("All milestones achieved")
                : `${progressPercentage}% to ${currentMilestone.points} L`}
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
      </View> */}

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Padding to compensate for fixed header */}
        <View style={styles.topPadding} />

        {/* Dynamic height container based on total path height */}
        <View style={{ height: totalSvgHeight }}>
          <ImageBackground
            // @ts-ignore
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
              {/* Path segments */}
              <G>
                {/* Completed path segment */}
                {completedPath && (
                  <Path
                    stroke="#26456C"
                    strokeLinecap="square"
                    strokeWidth={30}
                    d={completedPath}

                  />
                )}

                {/* Remaining path segment */}
                {remainingPath && (
                  <Path
                    stroke="#DBDBDB"
                    strokeLinecap="square"
                    strokeWidth={30}
                    d={remainingPath}
                  />
                )}

                {/* Milestone circles and labels */}
                {points.map((point, index) => {
                  const isStart = index === 0; // First point is start
                  const circleRadius = isStart ? 38 : 25;
                  const labelOffset = isStart ? 5 : 35;
                  const isEven = index % 2 === 0;
                  
                  const labelX = isStart
                    ? point.x
                    : isEven && !isStart
                      ? point.x - 10
                      : point.x + 10;
                      console.table("labelOffset,labelX,point.x,isEven,circleRadius,index")
                      console.table(labelOffset,labelX,point.x,isEven,circleRadius,index)
                  return (
                    <React.Fragment key={index}>
                      {/* Circle */}
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

                      {/* Icon inside circle */}
                      {point.iconType && (
                        
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
                          {/* <Ionicons  style={{zIndex:100,}} color="black" name="medal" />   */}
                          <Path d={iconPaths[point.iconType]} />
                        </G>
                      )}
                      <Text  x={labelX}
                        y={point.y + labelOffset }
                        fill={isStart ? "#fff" : "#26456C"}
                          color={"black"}>hi</Text>
                      {/* Label */}
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
    height: 100, // Height of the fixed progress card plus padding
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
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
  progressBarContainer: {
    height: 8,
    backgroundColor: "#DBDBDB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#26456C",
    borderRadius: 4,
  },
});

export default MilestoneComponent;
 