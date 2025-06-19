"use client"

import { BranchWithDistance, fetchDistancesWithGoogleAPI } from "@/components/branches/helpers/distance-helper"
import { getCurrentLocation,type UserLocation } from "@/components/branches/helpers/location-helper"
import { useState, useEffect } from "react"

export const useDistanceCalculation = (branches: any[]) => {
  const [userLocation, setUserLocation] = useState<UserLocation>({ latitude: 0, longitude: 0 })
  const [branchesWithDistance, setBranchesWithDistance] = useState<BranchWithDistance[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

  console.log("useDistanceCalculation - branches:", branches?.length || 0)

  // Get user location
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation()
      if (location) {
        setUserLocation(location)
        console.log("User location set:", location)
      } else {
        console.log("Could not get user location")
      }
    }
    fetchLocation()
  }, [])

  // Calculate distances when user location or branches change
  useEffect(() => {
    const calculateDistances = async () => {
      console.log("calculateDistances called - userLocation:", userLocation, "branches:", branches?.length || 0)

      if (!branches || branches.length === 0) {
        console.log("No branches to calculate distances for")
        setBranchesWithDistance([])
        return
      }

      // If no user location, just return original branches
      if (!userLocation.latitude || !userLocation.longitude) {
        console.log("No user location, returning original branches")
        setBranchesWithDistance(branches)
        return
      }

      setIsCalculating(true)
      try {
        console.log("Starting distance calculation...")
        const enrichedBranches = await fetchDistancesWithGoogleAPI(userLocation, branches, GOOGLE_API_KEY)
        console.log("Distance calculation completed:", enrichedBranches?.length || 0)
        setBranchesWithDistance(enrichedBranches)
      } catch (error) {
        console.error("Error calculating distances:", error)
        // Fallback to original branches
        setBranchesWithDistance(branches)
      } finally {
        setIsCalculating(false)
      }
    }

    calculateDistances()
  }, [userLocation, branches, GOOGLE_API_KEY])

  return {
    userLocation,
    branchesWithDistance,
    isCalculating,
  }
}
