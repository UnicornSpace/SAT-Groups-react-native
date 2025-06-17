"use client"

import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useState } from "react"
import Title from "@/components/General/title"
import { theme } from "@/infrastructure/themes"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useTranslation } from "react-i18next"
import NearBranchList from "@/components/Location/nearBranchList"
import AllBranches from "@/components/Location/allBranches"
import LocationSkeleton from "@/components/skeleton/location/location-skeleton"
import FuelStationDetails from "../(screens)/fuel-station"
import { useBranchData } from "@/hooks/use-branch-data"


const Location = () => {
  const { t } = useTranslation()
  const { branches, loading, error, refetch } = useBranchData()
  const [selectedBranch, setSelectedBranch] = useState(null)

  console.log("Location component - branches:", branches?.length || 0, "loading:", loading, "error:", error)

  if (loading) {
    return <LocationSkeleton />
  }

  return (
    <ScrollView>
      {!selectedBranch ? (
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Title>{t("Our Branches").trim()}</Title>
            <Text style={styles.description}>{t("Check out nearby branches")}</Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryText}>{t("Retry")}</Text>
              </TouchableOpacity>
            </View>
          ) : branches && branches.length > 0 ? (
            <>
              <NearBranchList branches={branches} />
              <AllBranches   branches={branches} onBranchClick={(item: any) => setSelectedBranch(item)} />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("No branches available at the moment")}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryText}>{t("Refresh")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View>
          <FuelStationDetails data={selectedBranch} onBack={() => setSelectedBranch(null)} />
        </View>
      )}
    </ScrollView>
  )
}

export default Location

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
  description: {
    fontSize: hp("1.8%"),
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.fontFamily.regular,
    marginTop: hp(-0.5),
  },
  errorContainer: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderColor: "#FED7D7",
    borderWidth: 1,
  },
  errorText: {
    color: "#E53E3E",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: theme.fontFamily.medium,
  },
  emptyContainer: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: theme.fontFamily.medium,
  },
  retryButton: {
    backgroundColor: theme.colors.brand.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: theme.fontFamily.semiBold,
  },
})
