import { useAuth } from "@/utils/AuthContext";
import axiosInstance from "@/utils/axionsInstance";
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

// Types
interface Milestone {
  id: string;
  requiredPoints: string;
  rewardPoints: string;
  rewardType: string;
  status: "claimed" | "unclaimed";
  position: number;
}

interface ApiResponse {
  status: string;
  totalPoints: number;
  mileStones: Milestone[];
}
const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
const { myDynamicPoints, driverId, token } = useAuth();

useEffect(() => {
  const fetchData = async () => {
    try {
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
      setApiResponse(response.data);
      console.log("Claim response:👍", response.data);
      
    } catch (error) {}
  };
  fetchData();
}, [driverId, token]);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MilestoneProgressPath: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();

        // Use the API response data
        setTimeout(() => {
          setApiData(apiResponse);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate positions and path
  const pathData = useMemo(() => {
    if (!apiData?.mileStones.length) return { pathString: "", positions: [] };

    const milestones = apiData.mileStones.sort(
      (a, b) => a.position - b.position
    );
    const totalMilestones = milestones.length;

    // Calculate available height (excluding header and padding)
    const headerHeight = 120;
    const bottomPadding = 100;
    const availableHeight = SCREEN_HEIGHT - headerHeight - bottomPadding;
    const segmentHeight = availableHeight / (totalMilestones - 1);

    // Path configuration
    const leftX = 80;
    const rightX = SCREEN_WIDTH - 80;
    const pathWidth = rightX - leftX;

    let pathString = "";
    const positions: Array<{ x: number; y: number; milestone: Milestone }> = [];

    milestones.forEach((milestone, index) => {
      // Calculate Y position (bottom to top)
      const y = SCREEN_HEIGHT - bottomPadding - segmentHeight * index;

      // Alternate between left and right
      const isEven = index % 2 === 0;
      const x = isEven ? leftX : rightX;

      positions.push({ x, y, milestone });

      if (index === 0) {
        // Start point
        pathString = `M ${x} ${y}`;
      } else {
        // Create smooth curve to next point
        const prevPos = positions[index - 1];
        const midY = (prevPos.y + y) / 2;

        // Control points for smooth S-curve
        const controlX1 = prevPos.x;
        const controlY1 = midY;
        const controlX2 = x;
        const controlY2 = midY;

        pathString += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${y}`;
      }
    });

    return { pathString, positions };
  }, [apiData]);

  // Calculate current progress
  const currentProgress = useMemo(() => {
    if (!apiData) return 0;

    const totalPoints = apiData.totalPoints;
    const milestones = apiData.mileStones.sort(
      (a, b) => a.position - b.position
    );

    // Find the current milestone range
    for (let i = 0; i < milestones.length; i++) {
      const currentRequired = parseInt(milestones[i].requiredPoints);
      const nextRequired =
        i < milestones.length - 1
          ? parseInt(milestones[i + 1].requiredPoints)
          : currentRequired;

      if (totalPoints >= currentRequired && totalPoints < nextRequired) {
        return (
          i + (totalPoints - currentRequired) / (nextRequired - currentRequired)
        );
      }
    }

    return milestones.length - 1; // Completed all milestones
  }, [apiData]);

  const renderMilestone = (
    position: { x: number; y: number; milestone: Milestone },
    index: number
  ) => {
    const { milestone } = position;
    const isClaimed = milestone.status === "claimed";
    const isGift = milestone.rewardType === "Gift";
    const isCurrentTarget = index === Math.floor(currentProgress) + 1;

    return (
      <View key={milestone.id}>
        {/* Milestone Circle */}
        <TouchableOpacity
          style={[
            styles.milestoneCircle,
            {
              position: "absolute",
              left: position.x - 25,
              top: position.y - 25,
            },
            isClaimed && styles.claimedCircle,
            isCurrentTarget && styles.currentTargetCircle,
          ]}
          onPress={() => console.log("Milestone pressed:", milestone)}
        >
          <Text style={[styles.milestoneText, isClaimed && styles.claimedText]}>
            {isGift ? "🎁" : `+${milestone.rewardPoints}`}
          </Text>
        </TouchableOpacity>

        {/* Required Points Label */}
        <View
          style={[
            styles.pointsLabel,
            {
              position: "absolute",
              left:
                position.x > SCREEN_WIDTH / 2
                  ? position.x - 80
                  : position.x + 35,
              top: position.y - 10,
            },
          ]}
        >
          <Text style={styles.pointsText}>{milestone.requiredPoints}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!apiData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Failed to load data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SAT Rewards</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Your Progress: {Math.floor(apiData.totalPoints)} /{" "}
            {apiData.mileStones[apiData.mileStones.length - 1]?.requiredPoints}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    100,
                    (apiData.totalPoints /
                      parseInt(
                        apiData.mileStones[apiData.mileStones.length - 1]
                          ?.requiredPoints || "500"
                      )) *
                      100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Path and Milestones */}
      <ScrollView
        style={styles.pathContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.svgContainer}>
          {/* SVG Path */}
          <Svg
            height={SCREEN_HEIGHT}
            width={SCREEN_WIDTH}
            style={StyleSheet.absoluteFillObject}
          >
            <Defs>
              <LinearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
                <Stop offset="50%" stopColor="#7B68EE" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#9370DB" stopOpacity="0.6" />
              </LinearGradient>
              <LinearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#00C851" stopOpacity="1" />
                <Stop offset="100%" stopColor="#007E33" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {/* Main Path */}
            <Path
              d={pathData.pathString}
              stroke="url(#pathGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Progress Path */}
            {currentProgress > 0 && (
              <Path
                d={pathData.pathString}
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${currentProgress * 100} ${1000}`}
              />
            )}
          </Svg>

          {/* Milestone Circles */}
          {pathData.positions.map((position, index) =>
            renderMilestone(position, index)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 4,
  },
  pathContainer: {
    flex: 1,
  },
  svgContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: "relative",
  },
  milestoneCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  claimedCircle: {
    backgroundColor: "#00C851",
    borderColor: "#007E33",
  },
  currentTargetCircle: {
    borderColor: "#FF6B35",
    borderWidth: 4,
    backgroundColor: "#FFF3E0",
  },
  milestoneText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
  },
  claimedText: {
    color: "#FFFFFF",
  },
  pointsLabel: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  pointsText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
});

export default MilestoneProgressPath;
