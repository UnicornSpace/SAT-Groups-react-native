"use client";

import { theme } from "@/infrastructure/themes";
import { useAuth } from "@/utils/AuthContext";
import { t } from "i18next";
import React, { useEffect, useRef, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text as RNText,
  SafeAreaView,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Text,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";

// Milestone data structure
type Milestone = {
  label: string;
  points?: number;
  isCurrent?: boolean;
  isAchieved?: boolean;
  iconType?: "gift" | "tshirt" | "coins" | "check" | "star" | "flag";
};

// Component props
interface MilestonePathProps {
  userPoints?: number; // Current user's points (optional)
  milestones?: Milestone[]; // Optional: Allow passing custom milestones
}

const SvgComponent: React.FC<MilestonePathProps> = ({
  userPoints: initialUserPoints,
  milestones: customMilestones,
}) => {
  // Move the useAuth hook inside the component
  const { myDynamicPoints } = useAuth();

  // Use provided points or fall back to context points or 0
  const userPoints =
    initialUserPoints !== undefined ? initialUserPoints : myDynamicPoints || 0;
    // initialUserPoints  = 500;

  const scrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get("window");

  // Dynamic milestones configuration
  const defaultMilestones: Milestone[] = [
    { label: "START", points: 0, isAchieved: false },
    { label: "1 L", points: 1, isAchieved: false, iconType: "tshirt" },
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
    // { label: "1500 L", points: 1500, isAchieved: false, iconType: "gift" },
    // { label: "1800 L", points: 1800, isAchieved: false, iconType: "gift" },
  ];

  // Use provided milestones or defaults
  const activeMilestones = customMilestones || defaultMilestones;

  // Process milestones based on user points
  const processedMilestones = useMemo(() => {
    return activeMilestones.map((milestone, index) => {
      const milestonePoints = milestone.points ?? 0;
      const isAchieved = userPoints >= milestonePoints;

      // Find the next unachieved milestone
      const isNext =
        !isAchieved &&
        (index === 0 ||
          userPoints >= (activeMilestones[index - 1].points ?? 0)) &&
        userPoints < milestonePoints;

      return {
        ...milestone,
        isAchieved,
        isCurrent: isNext,
      };
    });
  }, [userPoints, activeMilestones]);

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
        label: item.label,
        points: item.points ?? 0,
        isCurrent: item.isCurrent,
        isAchieved: item.isAchieved,
        iconType: item.iconType,
      });
    }

    return points;
  };

  // Calculate the progress percentage between milestones
  const calculateProgressPercentage = (
    points: number[],
    currentPoints: number
  ) => {
    // Find the current segment
    for (let i = 0; i < points.length - 1; i++) {
      const currentMilestone = points[i];
      const nextMilestone = points[i + 1];

      if (currentPoints >= currentMilestone && currentPoints < nextMilestone) {
        // Calculate percentage within this segment
        return (
          (currentPoints - currentMilestone) /
          (nextMilestone - currentMilestone)
        );
      }
    }

    // If user has reached or exceeded the last milestone
    if (currentPoints >= points[points.length - 1]) {
      return 1;
    }

    // If user hasn't reached the first milestone
    return 0;
  };

  // Generate path segments for differential coloring
  const generatePathSegments = (
    points: Array<{ x: number; y: number; points: number }>,
    userPoints: number
  ) => {
    if (points.length < 2) return { completedPath: "", remainingPath: "" };

    const segmentPaths: { start: number; end: number; path: string }[] = [];

    // Generate individual path segments
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Calculate control points for smooth curves
      const midY = current.y - (current.y - next.y) / 2;
      const cp1x = current.x;
      const cp1y = midY;
      const cp2x = next.x;
      const cp2y = midY;

      // Create path segment
      const segmentPath = `M ${current.x} ${current.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;

      segmentPaths.push({
        start: current.points,
        end: next.points,
        path: segmentPath,
      });
    }

    // Find the segment where user points fall
    let completedPath = "";
    let remainingPath = "";
    let partialSegmentPath = "";
    let foundPartialSegment = false;

    for (const segment of segmentPaths) {
      if (userPoints >= segment.end) {
        // This segment is completely achieved
        completedPath += " " + segment.path;
      } else if (userPoints <= segment.start) {
        // This segment hasn't been started yet
        remainingPath += " " + segment.path;
      } else {
        // This segment is partially completed
        foundPartialSegment = true;

        // Calculate how far along this segment the user is
        const progress =
          (userPoints - segment.start) / (segment.end - segment.start);

        // Split the segment at the right point
        const segmentParts = splitCubicBezier(
          {
            x: points[segmentPaths.indexOf(segment)].x,
            y: points[segmentPaths.indexOf(segment)].y,
          },
          {
            x: points[segmentPaths.indexOf(segment) + 1].x,
            y: points[segmentPaths.indexOf(segment) + 1].y,
          },
          progress
        );

        completedPath += " " + segmentParts.completed;
        remainingPath += " " + segmentParts.remaining;
      }
    }

    return { completedPath, remainingPath };
  };

  // Calculate points on a cubic Bezier curve at time t
  const calculateBezierPoint = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
  ) => {
    // Create midway control points for smooth transition between milestone points
    const midY = p0.y - (p0.y - p3.y) / 2;
    const cp1 = { x: p0.x, y: midY };
    const cp2 = { x: p3.x, y: midY };

    // Calculate point on curve at parameter t using the cubic Bezier formula
    return {
      x:
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * cp1.x +
        3 * (1 - t) * Math.pow(t, 2) * cp2.x +
        Math.pow(t, 3) * p3.x,
      y:
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * cp1.y +
        3 * (1 - t) * Math.pow(t, 2) * cp2.y +
        Math.pow(t, 3) * p3.y,
    };
  };

  // Split a cubic Bezier curve at a specific t value
  const splitCubicBezier = (
    p0: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
  ) => {
    // For zigzag path with control points based on midY calculation
    const midY = p0.y - (p0.y - p3.y) / 2;
    const p1 = { x: p0.x, y: midY }; // First control point
    const p2 = { x: p3.x, y: midY }; // Second control point

    // Calculate split point
    const splitPoint = calculateBezierPoint(p0, p1, p2, p3, t);

    // Calculate intermediate control points for first segment
    const p01 = {
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
    };

    const p12 = {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    };

    const p23 = {
      x: p2.x + (p3.x - p2.x) * t,
      y: p2.y + (p3.y - p2.y) * t,
    };

    const p012 = {
      x: p01.x + (p12.x - p01.x) * t,
      y: p01.y + (p12.y - p01.y) * t,
    };

    const p123 = {
      x: p12.x + (p23.x - p12.x) * t,
      y: p12.y + (p23.y - p12.y) * t,
    };

    // Return paths for completed segment and remaining segment
    return {
      completed: `M ${p0.x} ${p0.y} C ${p01.x} ${p01.y}, ${p012.x} ${p012.y}, ${splitPoint.x} ${splitPoint.y}`,
      remaining: `M ${splitPoint.x} ${splitPoint.y} C ${p123.x} ${p123.y}, ${p23.x} ${p23.y}, ${p3.x} ${p3.y}`,
    };
  };

  // Get dynamic points
  const points = calculatePoints(processedMilestones);

  // Generate path segments based on user progress
  const { completedPath, remainingPath } = generatePathSegments(
    points.map((p) => ({ x: p.x, y: p.y, points: p.points || 0 })),
    userPoints
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
  const userProgressInSegment = userPoints - (previousMilestone.points ?? 0);
  const progressPercentage =
    pointsToNextMilestone > 0
      ? Math.min(
          100,
          Math.floor((userProgressInSegment / pointsToNextMilestone) * 100)
        )
      : 100;

  // Icon SVG paths
  const iconPaths = {
    // Check mark icon
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",

    // Flag icon
    flag: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z",

    // Star icon
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",

    // Gift icon - wrapped present with bow
    gift: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z",

    // T-shirt icon
    tshirt:
      "M16 21H8c-1.1 0-2-.9-2-2v-7.32l-1.66 1.23L3 11.39 9 7h2l.48.36c.61.46 1.42.46 2.04 0L14 7h2l6 4.39-1.34 1.52L19 11.68V19c0 1.1-.9 2-2 2zM10 9l-6 4.39v-2.83l6-4.39V9zm10 0v-2.83l-6-4.39V9l6 4.39v-2.83z",

    // Coins icon
    coins:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z",
  };

  useEffect(() => {
    // Scroll to the bottom initially to show the start point
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fixed Progress Card at Top */}
      <View style={styles.fixedProgressContainer}>
        <View style={styles.progressCard}>
          <RNText style={styles.pointsText}>{t("Your Points")}: {userPoints}</RNText>
          <View style={styles.nextMilestoneContainer}>
            <RNText style={styles.milestoneText}>
              {userPoints >=
              (activeMilestones[activeMilestones.length - 1].points ?? 0)
                ? t("All milestones achieved")
                : `${progressPercentage}% to ${currentMilestone.label}`}
            </RNText>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${progressPercentage}%` }]}
              />
            </View>
          </View>
        </View>
      </View>

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
                    strokeLinecap="round"
                    strokeWidth={30}
                    d={completedPath}
                  />
                )}

                {/* Remaining path segment */}
                {remainingPath && (
                  <Path
                    stroke="#DBDBDB"
                    strokeLinecap="round"
                    strokeWidth={20}
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

                  return (
                    <React.Fragment key={index}>
                      {/* Circle */}
                      <Circle
                        cx={point.x }
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
                          <Path d={iconPaths[point.iconType]} />
                        </G>
                      )}

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
                        {point.label}
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
    position: 'relative',
 
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

export default SvgComponent;