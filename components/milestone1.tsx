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
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  ActivityIndicator,
  Snackbar,
  IconButton,
} from "react-native-paper";
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";

// Enhanced milestone type with more detailed status
interface Milestone {
  id: string;
  requiredPoints: number;
  rewardPoints: string;
  rewardType: string;
  status: "locked" | "unclaimed" | "claimed";
  position: number;
  // Computed properties
  label?: string;
  isCurrent?: boolean;
  isAchieved?: boolean;
  canClaim?: boolean;
  iconType?: "lock" | "points" | "coins" | "flag" | null;
}

// API Response type
interface ApiResponse {
  status: string;
  totalPoints: number;
  mileStones: Milestone[];
}

// Component props
interface MilestonePathProps {
  userPoints?: number;
  milestones?: Milestone[];
  onMilestoneClaimed?: (milestone: Milestone) => void;
}

declare const __DEV__: boolean;

const SvgComponent: React.FC<MilestonePathProps> = ({
  userPoints: initialUserPoints,
  milestones: customMilestones,
  onMilestoneClaimed,
}) => {
  const { myDynamicPoints, driverId, token } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get("window");

  // State for API data
  const [milestoneData, setMilestoneData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for claim functionality
  const [claimingMilestone, setClaimingMilestone] = useState<string | null>(
    null
  );
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Use provided points or fall back to context points or API totalPoints or 0
  const userPoints = useMemo(() => {
    return initialUserPoints !== undefined
      ? initialUserPoints
      : myDynamicPoints || milestoneData?.totalPoints || 0;
  }, [initialUserPoints, myDynamicPoints, milestoneData?.totalPoints]);

  // Enhanced function to determine milestone status and properties
  const getMilestoneProperties = (milestone: Milestone, userPoints: number) => {
    const isPointsReached = userPoints >= milestone.requiredPoints;

    // Log for debugging
    console.log('Processing milestone:', {
      id: milestone.id,
      position: milestone.position,
      requiredPoints: milestone.requiredPoints,
      status: milestone.status,
      userPoints,
      isPointsReached
    });

    // Determine status based on points and current status
    let computedStatus = milestone.status;
    let canClaim = false;
    let iconType: "lock" | "points" | "coins" | "flag" | null = null;

    // Start position (position 1 or requiredPoints 0) - always achieved
    if (milestone.position === 1 || milestone.requiredPoints === 0) {
      computedStatus = "claimed";
      iconType = "";
      canClaim = false;
    } 
    // Already claimed - this check should come early to prevent any override
    else if (milestone.status === "claimed") {
      computedStatus = "claimed";
      iconType = milestone.rewardType === "Points" ? "points" : "coins";
      canClaim = false;
    } 
    // Not enough points - locked
    else if (!isPointsReached) {
      computedStatus = "locked";
      iconType = "lock";
      canClaim = false;
    } 
    // Points reached and status is unclaimed - can claim
    else if (isPointsReached && milestone.status === "unclaimed") {
      computedStatus = "unclaimed";
      canClaim = true;
      iconType = milestone.rewardType === "Points" ? "points" : "coins";
    }
    // Fallback for any other case
    else {
      computedStatus = milestone.status;
      canClaim = false;
      iconType = milestone.rewardType === "Points" ? "points" : "coins";
    }

    const result = {
      ...milestone,
      status: computedStatus,
      canClaim,
      iconType,
      isAchieved: computedStatus === "claimed",
      isCurrent: canClaim,
    };

    console.log('Processed milestone result:', result);
    return result;
  };

  // Function to generate label from required points
  const generateLabel = (requiredPoints: number): string => {
    if (requiredPoints === 0) return "START";
    return `${requiredPoints} L`;
  };

  // Process API milestones to add computed properties
  const processApiMilestones = (apiData: ApiResponse): Milestone[] => {
    if (!apiData?.mileStones) return [];

    return apiData.mileStones
      .sort((a, b) => a.position - b.position)
      .map((milestone) => {
        const processedMilestone = {
          ...milestone,
          requiredPoints: parseInt(milestone.requiredPoints.toString()),
          label: generateLabel(parseInt(milestone.requiredPoints.toString())),
        };

        return getMilestoneProperties(processedMilestone, userPoints);
      });
  };

  // Use API data or custom milestones
  const activeMilestones = useMemo(() => {
    if (customMilestones) {
      return customMilestones.map((milestone) => {
        const processedMilestone = {
          ...milestone,
          label: milestone.label || generateLabel(milestone.requiredPoints),
        };
        return getMilestoneProperties(processedMilestone, userPoints);
      });
    }
    if (milestoneData) {
      return processApiMilestones(milestoneData);
    }
    return [];
  }, [customMilestones, milestoneData, userPoints]);

  // Function to handle milestone claim
  const handleClaimMilestone = async (milestone: Milestone) => {
    if (!milestone.canClaim || !driverId || !token) {
      console.log('Cannot claim milestone:', {
        canClaim: milestone.canClaim,
        status: milestone.status,
        driverId: !!driverId,
        token: !!token
      });
      return;
    }

    // Additional check to prevent claiming already claimed milestones
    if (milestone.status === "claimed") {
      console.log('Milestone already claimed:', milestone);
      setSnackbarMessage("This milestone has already been claimed.");
      setSnackbarVisible(true);
      return;
    }

    setClaimingMilestone(milestone.id);

    try {
      console.log('Attempting to claim milestone:', milestone);
      
      const response = await axiosInstance.post(
        "/claim-user-milestones.php",
        {
          driver_id: driverId,
          milestone_id: milestone.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Claim response:👍', response.data);

      if (response.data.status === "success") {
        // Update milestone status locally
        setMilestoneData((prevData) => {
          if (!prevData) return prevData;

          const updatedMilestones = prevData.mileStones.map((m) =>
            m.id === milestone.id ? { ...m, status: "claimed" as const } : m
          );

          return {
            ...prevData,
            mileStones: updatedMilestones,
            totalPoints:
              prevData.totalPoints + parseInt(milestone.rewardPoints),
          };
        });

        setSnackbarMessage(
          `Claimed ${milestone.rewardPoints} ${milestone.rewardType}!`
        );
        setSnackbarVisible(true);

        // Call callback if provided
        onMilestoneClaimed?.(milestone);
      } else {
        console.error('Claim failed:', response.data);
        throw new Error(response.data.message || "Failed to claim milestone");
      }
    } catch (error: any) {
      console.error("Error claiming milestone:", error);
      
      // More specific error messages
      let errorMessage = "Failed to claim milestone. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setClaimingMilestone(null);
      setShowClaimDialog(false);
      setSelectedMilestone(null);
    }
  };

  // Function to open claim dialog
  const openClaimDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowClaimDialog(true);
  };

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
        console.log("Milestone data:", data);
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
  }, [activeMilestones.length]);

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
        label: item.label || generateLabel(item.requiredPoints),
        points: item.requiredPoints,
        status: item.status,
        canClaim: item.canClaim,
        isAchieved: item.isAchieved,
        iconType: item.iconType,
        milestone: item,
      });
    }

    return points;
  };

  // Generate path segments for differential coloring
  const generatePathSegments = (
    points: Array<{ x: number; y: number; points: number; status: string }>,
    userPoints: number
  ) => {
    if (points.length < 2) return { completedPath: "", remainingPath: "" };

    const segmentPaths: {
      start: number;
      end: number;
      path: string;
      isCompleted: boolean;
    }[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const midY = current.y - (current.y - next.y) / 2;
      const cp1x = current.x;
      const cp1y = midY;
      const cp2x = next.x;
      const cp2y = midY;

      const segmentPath = `M ${current.x} ${current.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;

      // A segment is completed if both milestones are achieved or claimed
      const isCompleted =
        (current.status === "claimed" || current.status === "unclaimed") &&
        userPoints >= next.points;

      segmentPaths.push({
        start: current.points,
        end: next.points,
        path: segmentPath,
        isCompleted,
      });
    }

    let completedPath = "";
    let remainingPath = "";

    for (const segment of segmentPaths) {
      if (segment.isCompleted) {
        completedPath += " " + segment.path;
      } else {
        remainingPath += " " + segment.path;
      }
    }

    return { completedPath, remainingPath };
  };

  // Calculate derived values
  const points = useMemo(
    () => calculatePoints(activeMilestones),
    [activeMilestones]
  );

  const pathSegments = useMemo(
    () =>
      generatePathSegments(
        points.map((p) => ({
          x: p.x,
          y: p.y,
          points: p.points || 0,
          status: p.status || "locked",
        })),
        userPoints
      ),
    [points, userPoints]
  );

  const totalPathHeight = (activeMilestones.length - 1) * verticalSpacing;
  const totalSvgHeight = totalPathHeight + startY * 2;

  const currentMilestoneIndex = activeMilestones.findIndex((m) => m.canClaim);
  const previousMilestone =
    currentMilestoneIndex > 0
      ? activeMilestones[currentMilestoneIndex - 1]
      : activeMilestones[0];

  const currentMilestone =
    currentMilestoneIndex >= 0
      ? activeMilestones[currentMilestoneIndex]
      : activeMilestones.find((m) => userPoints < m.requiredPoints) ||
        activeMilestones[activeMilestones.length - 1];

  const pointsToNextMilestone =
    (currentMilestone?.requiredPoints ?? 0) -
    (previousMilestone?.requiredPoints ?? 0);
  const userProgressInSegment =
    userPoints - (previousMilestone?.requiredPoints ?? 0);
  const progressPercentage =
    pointsToNextMilestone > 0
      ? Math.min(
          100,
          Math.floor((userProgressInSegment / pointsToNextMilestone) * 100)
        )
      : 100;

  // Enhanced icon SVG paths
  const iconPaths = {
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z",
    points:
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    coins:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z",
    flag: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z",
  };

  // Function to get circle colors based on status
  const getCircleColors = (point: any, isStart: boolean) => {
    if (isStart) {
      return {
        fill: "#26456C",
        stroke: "#fff",
        strokeWidth: 3,
      };
    }

    switch (point.status) {
      case "claimed":
        return {
          fill: "#26456C",
          stroke: "#fff",
          strokeWidth: 3,
        };
      case "unclaimed":
        return {
          fill: "#4CAF50", // Green for claimable
          stroke: "#fff",
          strokeWidth: 4,
        };
      case "locked":
      default:
        return {
          fill: "#DBDBDB",
          stroke: "#fff",
          strokeWidth: 3,
        };
    }
  };

  // Function to get icon color based on status
  const getIconColor = (point: any, isStart: boolean) => {
    if (isStart) return "#fff";

    switch (point.status) {
      case "claimed":
        return "#fff";
      case "unclaimed":
        return "#fff";
      case "locked":
      default:
        return "#999";
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#26456C" />
        <Text style={styles.loadingText}>Loading milestones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>{error}</Text>
        <Button mode="contained" onPress={() => window.location.reload()}>
          Retry
        </Button>
      </View>
    );
  }

  if (!milestoneData && !customMilestones) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>No milestone data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Progress Card at Top */}
      <View style={styles.fixedProgressContainer}>
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.pointsText}>
              {t("Your Points")}: {userPoints}
            </Text>
            <View style={styles.nextMilestoneContainer}>
              <Text variant="bodyMedium" style={styles.milestoneText}>
                {userPoints >=
                (activeMilestones[activeMilestones.length - 1]
                  ?.requiredPoints ?? 0)
                  ? t("All milestones achieved")
                  : `${progressPercentage}% to ${
                      currentMilestone?.label || "Next milestone"
                    }`}
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
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

                  const circleColors = getCircleColors(point, isStart);
                  const iconColor = getIconColor(point, isStart);

                  return (
                    <React.Fragment key={index}>
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={circleRadius}
                        fill={circleColors.fill}
                        stroke={circleColors.stroke}
                        strokeWidth={circleColors.strokeWidth}
                      />

                      {/* Pulsing animation for claimable milestones */}
                      {point.canClaim && (
                        <Circle
                          cx={point.x}
                          cy={point.y}
                          r={circleRadius + 8}
                          fill="none"
                          stroke="#4CAF50"
                          strokeWidth={2}
                          opacity={0.6}
                        >
                          <animate
                            attributeName="r"
                            values={`${circleRadius + 4};${circleRadius + 12};${
                              circleRadius + 4
                            }`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.6;0.2;0.6"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </Circle>
                      )}

                      {point.iconType && iconPaths[point.iconType] && (
                        <G
                          transform={`translate(${point.x - 10}, ${
                            point.y - 10
                          }) scale(0.8)`}
                          fill={iconColor}
                        >
                          <Path d={iconPaths[point.iconType]} />
                        </G>
                      )}

                      <SvgText
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
                      </SvgText>

                      {/* Clickable area for claimable milestones */}
                      {point.canClaim && (
                        <Circle
                          cx={point.x}
                          cy={point.y}
                          r={circleRadius + 10}
                          fill="transparent"
                          onPress={() => openClaimDialog(point.milestone)}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </G>
            </Svg>
          </ImageBackground>
        </View>

        {/* Claimable Milestones Section */}
        {activeMilestones.filter((m) => m.canClaim === true && m.status === "unclaimed").length > 0 && (
          <View style={styles.claimableSection}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Ready to Claim
            </Text>
            {activeMilestones
              .filter((m) => m.canClaim === true && m.status === "unclaimed")
              .map((milestone) => (
                <Card key={milestone.id} style={styles.claimableCard}>
                  <Card.Content>
                    <View style={styles.claimableCardContent}>
                      <View style={styles.claimableInfo}>
                        <Text variant="titleMedium">{milestone.label}</Text>
                        <Text variant="bodyMedium" style={styles.rewardText}>
                          Reward: {milestone.rewardPoints}{" "}
                          {milestone.rewardType}
                        </Text>
                        <Text variant="bodySmall" style={{ color: '#666', marginTop: 2 }}>
                          Status: {milestone.status} | Can Claim: {milestone.canClaim ? 'Yes' : 'No'}
                        </Text>
                      </View>
                      <Button
                        mode="contained"
                        onPress={() => openClaimDialog(milestone)}
                        loading={claimingMilestone === milestone.id}
                        disabled={claimingMilestone !== null}
                        style={styles.claimButton}
                      >
                        Claim
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ))}
          </View>
        )}

       
      </ScrollView>

      {/* Claim Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showClaimDialog}
          onDismiss={() => setShowClaimDialog(false)}
        >
          <Dialog.Title>Claim Milestone</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyLarge">
              Are you sure you want to claim this milestone?
            </Text>
            {selectedMilestone && (
              <View style={styles.dialogDetails}>
                <Text variant="bodyMedium">
                  Milestone: {selectedMilestone.label}
                </Text>
                <Text variant="bodyMedium">
                  Reward: {selectedMilestone.rewardPoints}{" "}
                  {selectedMilestone.rewardType}
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowClaimDialog(false)}
              disabled={claimingMilestone !== null}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                selectedMilestone && handleClaimMilestone(selectedMilestone)
              }
              loading={claimingMilestone !== null}
              disabled={claimingMilestone !== null}
            >
              Claim
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    paddingBottom: 20,
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
    marginHorizontal: 16,
  },
  pointsText: {
    color: "#26456C",
    marginBottom: 8,
    fontWeight: "bold",
  },
  nextMilestoneContainer: {
    marginTop: 8,
  },
  milestoneText: {
    color: "#666",
    marginBottom: 4,
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
    marginTop: 16,
  },
  claimableSection: {
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    color: "#26456C",
    marginBottom: 16,
    fontWeight: "bold",
  },
  claimableCard: {
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
  },
  claimableCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  claimableInfo: {
    flex: 1,
  },
  rewardText: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 4,
  },
  claimButton: {
    backgroundColor: "#4CAF50",
  },
  dialogDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
});

export default SvgComponent;