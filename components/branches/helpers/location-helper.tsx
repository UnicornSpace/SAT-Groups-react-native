import * as Location from "expo-location"
import * as Linking from "expo-linking"
import { Alert } from "react-native"

export interface UserLocation {
  latitude: number
  longitude: number
}

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Location Permission Required", "Allow location access to use this feature smoothly.", [
        { text: "Open Settings", onPress: () => Linking.openSettings() },
        { text: "Cancel", style: "cancel" },
      ])
      return false
    }

    return true
  } catch (error) {
    console.error("Error requesting location permission:", error)
    return false
  }
}

export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    const hasPermission = await requestLocationPermission()
    if (!hasPermission) return null

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    console.log("User location:", location.coords)
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  } catch (error) {
    console.error("Error getting location:", error)
    Alert.alert("Error", "Failed to get current location")
    return null
  }
}

export const openInGoogleMaps = async (
  userLocation: UserLocation,
  destinationLat: string | number,
  destinationLng: string | number,
) => {
  try {
    const hasPermission = await requestLocationPermission()
    if (!hasPermission) return

    // Clean coordinates from any spaces or extra characters
    const cleanLat =
      typeof destinationLat === "string" ? Number.parseFloat(destinationLat.replace(/[^0-9.-]/g, "")) : destinationLat
    const cleanLng =
      typeof destinationLng === "string" ? Number.parseFloat(destinationLng.replace(/[^0-9.-]/g, "")) : destinationLng

    if (isNaN(cleanLat) || isNaN(cleanLng)) {
      Alert.alert("Error", "Invalid location coordinates")
      return
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${cleanLat},${cleanLng}`
    await Linking.openURL(url)
  } catch (error) {
    console.error("Error opening maps:", error)
    Alert.alert("Error", "Failed to open Google Maps")
  }
}

export const openDirectGoogleMapsLink = async (link: string) => {
  try {
    const hasPermission = await requestLocationPermission()
    if (!hasPermission) return

    await Linking.openURL(link)
  } catch (error) {
    console.error("Error opening maps:", error)
    Alert.alert("Error", "Failed to open Google Maps")
  }
}
