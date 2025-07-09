"use client"

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { iconPaths } from "@/components/icons"
import { generatePathSegments } from "@/utils"
import type React from "react"
import { useEffect, useRef, useMemo, useState, useCallback } from "react"
import { type ScrollView, View, StyleSheet, PanResponder, Alert } from "react-native"
import { useAuth } from "@/utils/auth-context"
import { useFocusEffect } from "expo-router"
import { getMilestoneData } from "@/api/milestone/milestone-data"
import { claimMilestone } from "@/api/milestone/claim-milestone"
import MilestoneHeader from "./milestone-header"
import MilestoneModal from "./milestone-modal"
import MilestonePath from "./milestone-path"
import {
  leftPosition,
  rightPosition,
  startY,
  svgWidth,
  verticalSpacing,
} from "@/infrastructure/constants/milestone-path-constants"

// Define the Milestone type
interface Milestone {
  id: string
  requiredPoints: string
  rewardPoints: string
  rewardType: "Points" | "Other"
  status: "claimed" | "unclaimed"
  position: number
  isAchieved?: boolean
  isCurrent?: boolean
}

// Define the MilestonePathProps type
interface MilestonePathProps {
  milestones: Milestone[]
  totalPoints: number
}

const MilestoneComponent: React.FC<MilestonePathProps> = ({
  milestones: milestoneData,
  totalPoints: initialTotalPoints,
}) => {
  const scrollRef = useRef<ScrollView>(null)
  const [visible, setVisible] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [claiming, setClaiming] = useState(false) // Add loading state for claiming
  const [isloading, setisloading] = useState(false) // Add loading state for claiming

  // Add state for total points and milestones to handle updates
  const [totalPoints, setTotalPoints] = useState<number>(0)
  const [milestones, setMilestones] = useState<Milestone[]>([])

  const { token, driverId } = useAuth()

  useEffect(() => {
    // Initialize total points with the initial value
    setTotalPoints(initialTotalPoints)
    setMilestones(milestoneData)
  }, [initialTotalPoints, milestoneData])

  // Process milestones based on user points
  const processedMilestones = useMemo(() => {
    return milestones.map((milestone, index) => {
      if (!milestone) {
        console.warn(`Milestone at index ${index} is undefined`)
        return {
          id: `default-${index}`,
          requiredPoints: "0",
          rewardPoints: "0",
          rewardType: "Points" as const,
          status: "unclaimed" as const,
          position: index + 1,
          isAchieved: false,
          isCurrent: false,
        }
      }
      const milestonePoints = Number(milestone.requiredPoints) || 0
      const isAchieved = totalPoints >= milestonePoints

      const isNext =
        !isAchieved &&
        (index === 0 || totalPoints >= (Number(milestones[index - 1].requiredPoints) || 0)) &&
        totalPoints < milestonePoints

      return {
        ...milestone,
        isAchieved,
        isCurrent: isNext,
      }
    })
  }, [totalPoints, milestones])

  // Calculate coordinates for each milestone
  const calculatePoints = (items: Milestone[]) => {
    const points = []
    const totalItems = items.length
    const totalPathHeight = (totalItems - 1) * verticalSpacing
    const currentY = totalPathHeight + startY

    for (let index = 0; index < totalItems; index++) {
      const item = items[index]
      const isEven = index % 2 === 0

      const x = index === 0 ? svgWidth / 2 : isEven ? leftPosition : rightPosition
      const y = currentY - index * verticalSpacing

      points.push({
        x,
        y,
        label: `${item.requiredPoints} L`,
        points: item.requiredPoints ?? 0,
        isCurrent: item.isCurrent,
        isAchieved: Number(item.requiredPoints) <= totalPoints,
        rewardType: item.rewardType,
        milestone: item,
      })
    }

    return points
  }

  const points = calculatePoints(processedMilestones)

  const { completedPath, remainingPath } = generatePathSegments(
    points.map((p) => ({ x: p.x, y: p.y, points: Number(p.points) })),
    totalPoints,
  )

  const totalPathHeight = (processedMilestones.length - 1) * verticalSpacing
  const totalSvgHeight = totalPathHeight + startY * 2.2

  const currentMilestoneIndex = processedMilestones.findIndex((m) => m.isCurrent)
  const previousMilestone =
    currentMilestoneIndex > 0 ? processedMilestones[currentMilestoneIndex - 1] : processedMilestones[0] || null

  const currentMilestone =
    currentMilestoneIndex >= 0
      ? processedMilestones[currentMilestoneIndex]
      : processedMilestones.length > 0
        ? processedMilestones[processedMilestones.length - 1]
        : null

  const pointsToNextMilestone = currentMilestone
    ? (Number(currentMilestone.requiredPoints) || 0) - (Number(previousMilestone?.requiredPoints) || 0)
    : 0
  const userProgressInSegment = previousMilestone
    ? totalPoints - (Number(previousMilestone.requiredPoints) || 0)
    : totalPoints
  const progressPercentage =
    pointsToNextMilestone > 0 ? Math.min(100, Math.floor((userProgressInSegment / pointsToNextMilestone) * 100)) : 100

  useEffect(() => {
    const HEADER_HEIGHT = hp(8)
    if (scrollRef.current && currentMilestoneIndex !== -1) {
      scrollRef.current.scrollTo({
        y: (processedMilestones.length - 1 - currentMilestoneIndex) * HEADER_HEIGHT,
        animated: true,
      })
    }
  }, [currentMilestoneIndex])

  const showModal = (milestone: any) => {
    setSelectedMilestone(milestone)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedMilestone(null)
  }

  const handleMilestonePress = (point: any) => {
    showModal(point.milestone)
  }

  const fetchUserMilestones = async () => {
    try {
      setRefreshing(true)
      const response = await getMilestoneData(driverId, token)

      if (response.data && response.data.milestones) {
        // Update milestones state with fresh data
        setMilestones(response.data.milestones)

        // Update total points if provided by API
        if (response.data.totalPoints !== undefined) {
          setTotalPoints(response.data.totalPoints)
        }
      }
      setisloading(false)
      return response.data
    } catch (error) {
      console.error("Error fetching milestones:", error)
      Alert.alert("Error", "Failed to fetch milestone data")
      throw error
    } finally {
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserMilestones()
    }, [driverId, token]),
  )

  const handleClaim = async (milestone: Milestone) => {
    // Check if milestone is already claimed
    if (milestone.status === "claimed") {
      Alert.alert("Already Claimed", "This milestone has already been claimed!")
      hideModal()
      return
    }

    // Check if user has enough points
    if (totalPoints < Number(milestone.requiredPoints)) {
      Alert.alert("Insufficient Points", "You don't have enough points to claim this milestone!")
      hideModal()
      return
    }

    console.log("Claiming milestone:✅✅", milestone)
    const milestoneId = milestone.id

    try {
      setClaiming(true)

      // Call the claim API
      const response = await claimMilestone(driverId, token, milestoneId)

     if (response.status !== 200) {
        const errorMessage =
          response?.data?.message ||
          "Failed to claim milestone. Please try again later.";
        Alert.alert("Error", errorMessage);
        return;
      }

      // Immediately update the local state to show claimed status
      setMilestones((prevMilestones) =>
        prevMilestones.map((m) => (m.id === milestoneId ? { ...m, status: "claimed" as const } : m)),
      )

   
      await fetchUserMilestones()

      Alert.alert("Success!", `Milestone claimed! You earned ${milestone.rewardPoints} points.`)
    } catch (error) {
      console.error("Error claiming milestone:", error)
      Alert.alert("Error", "Failed to claim milestone. Please try again.")

      // Revert the optimistic update if there was an error
      setMilestones((prevMilestones) =>
        prevMilestones.map((m) => (m.id === milestoneId ? { ...m, status: milestone.status } : m)),
      )
    } finally {
      setClaiming(false)
      hideModal()
    }
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => false,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent

      // Calculate touch tolerance (responsive)
      const touchTolerance = wp(10)

      const tappedIndex = points.findIndex((point) => {
        const distance = Math.hypot(locationX - point.x, locationY - point.y)
        return distance < touchTolerance
      })

      if (tappedIndex !== -1) {
        handleMilestonePress(points[tappedIndex])
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      return false
    },

    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {},
    onPanResponderTerminate: (evt, gestureState) => {},
    onShouldBlockNativeResponder: (evt, gestureState) => false,
  })

const onRefresh = async () => {
  setRefreshing(true)
  try {
    await fetchUserMilestones()
  } catch (err) {
    console.error("Error refreshing:", err)
  } finally {
    setRefreshing(false)
  }
}


  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <MilestoneHeader
        totalPoints={totalPoints}
        milestones={milestones}
        currentMilestone={currentMilestone}
        progressPercentage={progressPercentage}
      />

      {/* Modal */}
      <MilestoneModal
        visible={visible}
        hideModal={hideModal}
        selectedMilestone={selectedMilestone}
        totalPoints={totalPoints}
        progressPercentage={progressPercentage}
        handleClaim={handleClaim}
        claiming={claiming} // Pass claiming state to modal
      />

      {/* Scrollable Content with PanResponder */}
      <MilestonePath
        refreshing={refreshing}
        onRefresh={onRefresh}
        scrollRef={scrollRef}
        panResponder={panResponder}
        svgWidth={svgWidth}
        totalSvgHeight={totalSvgHeight}
        completedPath={completedPath}
        remainingPath={remainingPath}
        points={points}
        iconPaths={iconPaths}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
})

export default MilestoneComponent
