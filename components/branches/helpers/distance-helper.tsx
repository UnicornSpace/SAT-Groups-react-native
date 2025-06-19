import axios from "axios"
import { getDistance } from "geolib"
import type { UserLocation } from "@/components/branches/helpers/location-helper"

export interface BranchWithDistance {
  distance: string
  duration: string
  distanceValue: number
  [key: string]: any
}

export const calculateBasicDistance = (
  userLocation: UserLocation,
  branchLat: string | number,
  branchLng: string | number,
): string => {
  if (!userLocation.latitude || !userLocation.longitude) return "-- KM"

  const cleanLat = typeof branchLat === "string" ? Number.parseFloat(branchLat.replace(/[^0-9.-]/g, "")) : branchLat
  const cleanLng = typeof branchLng === "string" ? Number.parseFloat(branchLng.replace(/[^0-9.-]/g, "")) : branchLng

  if (isNaN(cleanLat) || isNaN(cleanLng)) return "-- KM"

  const distance = getDistance(
    {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    },
    { latitude: cleanLat, longitude: cleanLng },
  )

  return `${(distance / 1000).toFixed(1)} KM`
}

export const calculateDistanceWithGeolib = (
  userLocation: UserLocation,
  branchLat: string | number,
  branchLng: string | number,
) => {
  const cleanLat = typeof branchLat === "string" ? Number.parseFloat(branchLat.replace(/[^0-9.-]/g, "")) : branchLat
  const cleanLng = typeof branchLng === "string" ? Number.parseFloat(branchLng.replace(/[^0-9.-]/g, "")) : branchLng

  const distance = getDistance(
    { latitude: userLocation.latitude, longitude: userLocation.longitude },
    { latitude: cleanLat, longitude: cleanLng },
  )

  // Estimate duration based on distance (assuming average speed of 40 km/h in city)
  const estimatedDurationMinutes = Math.round((distance / 1000) * 1.5)
  const estimatedDuration =
    estimatedDurationMinutes > 60
      ? `${Math.floor(estimatedDurationMinutes / 60)}h ${estimatedDurationMinutes % 60}m`
      : `${estimatedDurationMinutes} min`

  return {
    distance: `${(distance / 1000).toFixed(1)} km`,
    duration: estimatedDuration,
    distanceValue: distance,
  }
}

export const fetchDistancesWithGoogleAPI = async (
  userLocation: UserLocation,
  branches: any[],
  googleApiKey?: string,
): Promise<BranchWithDistance[]> => {
  // Check if we have required data
  if (!userLocation.latitude || !userLocation.longitude || !branches || branches.length === 0) {
    console.log("Missing required data for distance calculation")
    return branches
  }

  try {
    console.log("Fetching distances for", branches.length, "branches")

    // Validate branch data has required coordinates
    const validBranches = branches.filter(
      (loc: any) => loc.lat && loc.lng && !isNaN(Number.parseFloat(loc.lat)) && !isNaN(Number.parseFloat(loc.lng)),
    )

    if (validBranches.length === 0) {
      console.error("No valid branch coordinates found")
      return branches
    }

    // Check if Google API key is available
    if (!googleApiKey) {
      console.warn("Google API key not found, using fallback distance calculation")
      // Fallback to geolib for distance calculation
      const enrichedWithGeolib = validBranches.map((loc: any) => {
        const distanceData = calculateDistanceWithGeolib(userLocation, loc.lat, loc.lng)
        return {
          ...loc,
          ...distanceData,
        }
      })

      return enrichedWithGeolib.sort((a, b) => a.distanceValue - b.distanceValue)
    }

    const destinations = validBranches
      .map((loc: any) => `${Number.parseFloat(loc.lat)},${Number.parseFloat(loc.lng)}`)
      .join("|")

    const origin = `${userLocation.latitude},${userLocation.longitude}`

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&mode=driving&units=metric&key=${googleApiKey}`

    console.log("Distance Matrix API URL:", url.replace(googleApiKey, "API_KEY_HIDDEN"))

    const response = await axios.get(url)
    console.log("Distance Matrix API Response:", response.data)

    if (response.data.status !== "OK") {
      console.error("Google API error:", response.data.status, response.data.error_message)
      throw new Error(`Google API error: ${response.data.status}`)
    }

    const results = response.data.rows[0]?.elements

    if (!results) {
      console.error("No results from Distance Matrix API")
      return validBranches
    }

    const enriched = validBranches.map((loc: any, i: number) => {
      const result = results[i]
      console.log(`Branch ${i} (${loc.location_name}):`, result)

      // Check if the result is OK
      if (result?.status === "OK") {
        return {
          ...loc,
          distance: result.distance?.text || "Loading...",
          duration: result.duration?.text || "Loading...",
          distanceValue: result.distance?.value || 9999999,
        }
      } else {
        console.warn(`No route found for branch ${i}:`, result?.status)
        // Fallback to geolib calculation for this branch
        const distanceData = calculateDistanceWithGeolib(userLocation, loc.lat, loc.lng)
        return {
          ...loc,
          ...distanceData,
        }
      }
    })

    return enriched.sort((a, b) => a.distanceValue - b.distanceValue)
  } catch (error) {
    console.error("Failed to fetch distances:", error)
    // Fallback to original data without distances
    return branches
  }
}
