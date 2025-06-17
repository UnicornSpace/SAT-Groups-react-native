import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type React from "react"
import { theme } from "@/infrastructure/themes"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useTranslation } from "react-i18next"
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import LocationIcon from "./locationIcon"
import { openDirectGoogleMapsLink } from "./helpers/location-helper"
import { sentenceCase } from "@/utils"
import { useDistanceCalculation } from "@/hooks/use-distance-calc"


interface NearBranchListProps {
  branches: any[]
}

const Branches = ({ data, userLocation }: any) => {
  const { t } = useTranslation()

  console.log("Branches component - received data:", data?.length || 0)

  // Data handling
  if (!data || !Array.isArray(data)) {
    console.log("No branch data available in Branches component")
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No branch data available</Text>
      </View>
    )
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No branches found</Text>
      </View>
    )
  }

  // Limit to first 3 branches based on distance
  const branchesToShow = data.slice(0, 3)
  console.log("Showing", branchesToShow.length, "branches")

  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {branchesToShow.map((item: any, index: number) => {
        return (
          <TouchableOpacity
            key={item.location_code || item.id || `branch-${index}`}
            onPress={() => {
              if (item.google_map_link) {
                openDirectGoogleMapsLink(item.google_map_link)
              } else {
                console.log("No Google Maps link available for this branch")
              }
            }}
            style={styles.card}
          >
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamily.semiBold,
                    fontSize: hp(2),
                    color: theme.colors.brand.blue,
                  }}
                >
                  {sentenceCase(item.location_name || item.name || "Branch")}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="map-pin" size={10} color="black" />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.medium,
                      fontSize: hp(1.5),
                      marginBottom: -4,
                      opacity: 0.8,
                    }}
                  >
                    {item.distance || "Calculating..."}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "baseline",
                  }}
                >
                  <MaterialCommunityIcons name="timer-sand-full" size={10} color="black" />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.medium,
                      fontSize: hp(1.6),
                      opacity: 0.8,
                    }}
                  >
                    {item.duration || "Calculating..."}
                  </Text>
                </View>
              </View>
            </View>
            <LocationIcon />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const NearBranchList: React.FC<NearBranchListProps> = ({ branches }) => {
  const { userLocation, branchesWithDistance, isCalculating } = useDistanceCalculation(branches)

  console.log(
    "NearBranchList - branches:",
    branches?.length || 0,
    "branchesWithDistance:",
    branchesWithDistance?.length || 0,
  )

  // Use original branches if distance calculation hasn't completed yet
  const dataToShow = branchesWithDistance.length > 0 ? branchesWithDistance : branches

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: wp("90%"),
      }}
    >
      {isCalculating && branchesWithDistance.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text>Calculating distances...</Text>
        </View>
      ) : (
        <Branches data={dataToShow} userLocation={userLocation} />
      )}
    </View>
  )
}

export default NearBranchList

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F3F5",
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
    borderLeftWidth: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.3),
    elevation: 2.5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: hp(3),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: hp(3),
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.fontFamily.medium,
  },
})
