"use client";

import { theme } from "@/infrastructure/themes";
import { useAuth } from "@/utils/AuthContext";
import axiosInstance from "@/utils/axionsInstance";
import { t } from "i18next";
import React, { useEffect, useRef, useMemo, useState } from "react";
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
  id?: string;
  rewardType?: string;
  rewardPoints?: string;
  status?: string;
  position?: number;
};

// API Response types
interface ApiMilestone {
  id: string;
  requiredPoints: string;
  rewardPoints: string;
  rewardType: string;
  status: string;
  position: number;
}

interface ApiResponse {
  status: string;
  totalPoints: number;
  mileStones: ApiMilestone[];
}

// Component props
interface MilestonePathProps {
  userPoints?: number;
  milestones?: Milestone[];
}

const SvgComponent: React.FC<MilestonePathProps> = ({
  userPoints: initialUserPoints,
  milestones: customMilestones,
}) => {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NO CONDITIONAL HOOKS
  const { myDynamicPoints, driverId, token } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get("window");
  
  // State for API data
  const [milestoneData, setMilestoneData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use provided points or fall back to context points or API totalPoints or 0
  const userPoints = useMemo(() => {
    return initialUserPoints !== undefined 
      ? initialUserPoints 
      : myDynamicPoints || milestoneData?.totalPoints || 0;
  }, [initialUserPoints, myDynamicPoints, milestoneData?.totalPoints]);

  // Function to map reward type to icon type
  const getIconType = (rewardType: string, requiredPoints: number): "gift" | "tshirt" | "coins" | "check" | "star" | "flag" => {
    if (requiredPoints === 0) return "flag";
    
    switch (rewardType.toLowerCase()) {
      case "gift":
        return "gift";
      case "points":
        if (requiredPoints >= 500) return "gift";
        if (requiredPoints >= 100) return "coins";
        if (requiredPoints >= 50) return "coins";
        return "tshirt";
      default:
        return "coins";
    }
  };

  // Function to generate label from required points
  const generateLabel = (requiredPoints: number): string => {
    if (requiredPoints === 0) return "START";
    return `${requiredPoints} L`;
  };

  // Convert API data to Milestone format
  const convertApiDataToMilestones = (apiData: ApiResponse): Milestone[] => {
    if (!apiData?.mileStones) return [];

    return apiData.mileStones
      .sort((a, b) => a.position - b.position)
      .map((milestone) => {
        const requiredPoints = parseInt(milestone.requiredPoints);
        return {
          id: milestone.id,
          label: generateLabel(requiredPoints),
          points: requiredPoints,
          isAchieved: false,
          iconType: getIconType(milestone.rewardType, requiredPoints),
          rewardType: milestone.rewardType,
          rewardPoints: milestone.rewardPoints,
          status: milestone.status,
          position: milestone.position,
        };
      });
  };

  // Use API data converted to milestones, or custom milestones, or empty array
  const activeMilestones = useMemo(() => {
    if (customMilestones) return customMilestones;
    if (milestoneData) return convertApiDataToMilestones(milestoneData);
    return [];
  }, [customMilestones, milestoneData]);

  // Process milestones based on user points
  const processedMilestones = useMemo(() => {
    return activeMilestones.map((milestone, index) => {
      const milestonePoints = milestone.points ?? 0;
      const isAchieved = userPoints >= milestonePoints;

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

  // API call effect
  useEffect(() => {
    const fetchMilestoneData = async () => {
      if (!driverId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.post(
          "/get-user-milestones.php",
          {
            driver_id: driverId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: ApiResponse = response.data;
        console.log("😂", data);
        setMilestoneData(data);
      } catch (error) {
        console.error("Error fetching milestone data:", error);
        setError("Failed to load milestone data");
      } finally {
        setLoading(false);
      }
    };

    fetchMilestoneData();
  }, [driverId, token]);

  // Scroll to bottom effect
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);

    return () => clearTimeout(timer);
  }, [processedMilestones.length]);

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
      const x = index === 0 ? svgWidth / 2 : isEven ? leftPosition : rightPosition;
      const y = currentY - index * verticalSpacing;

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

  // Generate path segments for differential coloring
  const generatePathSegments = (
    points: Array<{ x: number; y: number; points: number }>,
    userPoints: number
  ) => {
    if (points.length < 2) return { completedPath: "", remainingPath: "" };

    const segmentPaths: { start: number; end: number; path: string }[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const midY = current.y - (current.y - next.y) / 2;
      const cp1x = current.x;
      const cp1y = midY;
      const cp2x = next.x;
      const cp2y = midY;

      const segmentPath = `M ${current.x} ${current.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;

      segmentPaths.push({
        start: current.points,
        end: next.points,
        path: segmentPath,
      });
    }

    let completedPath = "";
    let remainingPath = "";

    for (const segment of segmentPaths) {
      if (userPoints >= segment.end) {
        completedPath += " " + segment.path;
      } else if (userPoints <= segment.start) {
        remainingPath += " " + segment.path;
      } else {
        const progress = (userPoints - segment.start) / (segment.end - segment.start);
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
    const midY = p0.y - (p0.y - p3.y) / 2;
    const cp1 = { x: p0.x, y: midY };
    const cp2 = { x: p3.x, y: midY };

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
    const midY = p0.y - (p0.y - p3.y) / 2;
    const p1 = { x: p0.x, y: midY };
    const p2 = { x: p3.x, y: midY };

    const splitPoint = calculateBezierPoint(p0, p1, p2, p3, t);

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

    return {
      completed: `M ${p0.x} ${p0.y} C ${p01.x} ${p01.y}, ${p012.x} ${p012.y}, ${splitPoint.x} ${splitPoint.y}`,
      remaining: `M ${splitPoint.x} ${splitPoint.y} C ${p123.x} ${p123.y}, ${p23.x} ${p23.y}, ${p3.x} ${p3.y}`,
    };
  };

  // Calculate derived values
  const points = useMemo(() => calculatePoints(processedMilestones), [processedMilestones]);
  
  const pathSegments = useMemo(() => 
    generatePathSegments(
      points.map((p) => ({ x: p.x, y: p.y, points: p.points || 0 })),
      userPoints
    ), [points, userPoints]
  );

  const totalPathHeight = (processedMilestones.length - 1) * verticalSpacing;
  const totalSvgHeight = totalPathHeight + startY * 2;

  const currentMilestoneIndex = processedMilestones.findIndex((m) => m.isCurrent);
  const previousMilestone = currentMilestoneIndex > 0
    ? processedMilestones[currentMilestoneIndex - 1]
    : processedMilestones[0];

  const currentMilestone = currentMilestoneIndex >= 0
    ? processedMilestones[currentMilestoneIndex]
    : processedMilestones[processedMilestones.length - 1];

  const pointsToNextMilestone = (currentMilestone?.points ?? 0) - (previousMilestone?.points ?? 0);
  const userProgressInSegment = userPoints - (previousMilestone?.points ?? 0);
  const progressPercentage = pointsToNextMilestone > 0
    ? Math.min(100, Math.floor((userProgressInSegment / pointsToNextMilestone) * 100))
    : 100;

  // Icon SVG paths
  const iconPaths = {
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    flag: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    gift: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z",
    tshirt: "M16 21H8c-1.1 0-2-.9-2-2v-7.32l-1.66 1.23L3 11.39 9 7h2l.48.36c.61.46 1.42.46 2.04 0L14 7h2l6 4.39-1.34 1.52L19 11.68V19c0 1.1-.9 2-2 2zM10 9l-6 4.39v-2.83l6-4.39V9zm10 0v-2.83l-6-4.39V9l6 4.39v-2.83z",
    coins: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z",
  };

  // RENDER LOGIC - Handle all states here without early returns
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <RNText style={styles.loadingText}>Loading milestones...</RNText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <RNText style={styles.loadingText}>{error}</RNText>
      </View>
    );
  }

  if (!milestoneData && !customMilestones) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <RNText style={styles.loadingText}>No milestone data available</RNText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Progress Card at Top */}
      <View style={styles.fixedProgressContainer}>
        <View style={styles.progressCard}>
          <RNText style={styles.pointsText}>
            {t("Your Points")}: {userPoints}
          </RNText>
          <View style={styles.nextMilestoneContainer}>
            <RNText style={styles.milestoneText}>
              {userPoints >= (activeMilestones[activeMilestones.length - 1]?.points ?? 0)
                ? t("All milestones achieved")
                : `${progressPercentage}% to ${currentMilestone?.label || 'Next milestone'}`}
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

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topPadding} />

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
              <G>
                {pathSegments.completedPath && (
                  <Path
                    stroke="#26456C"
                    strokeLinecap="round"
                    strokeWidth={30}
                    d={pathSegments.completedPath}
                  />
                )}

                {pathSegments.remainingPath && (
                  <Path
                    stroke="#DBDBDB"
                    strokeLinecap="round"
                    strokeWidth={20}
                    d={pathSegments.remainingPath}
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

                      {point.iconType && (
                        <G
                          transform={`translate(${point.x - 10}, ${point.y - 10}) scale(0.8)`}
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
    position: "relative",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topPadding: {
    height: 100,
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: theme.fontFamily.regular,
  },
});

export default SvgComponent;