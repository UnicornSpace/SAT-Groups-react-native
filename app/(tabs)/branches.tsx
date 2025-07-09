import { ScrollView, StyleSheet, View, RefreshControl, Text } from "react-native";
import { useState } from "react";
import LocationSkeleton from "@/components/skeleton/location/location-skeleton";
import FuelStationDetails from "../(screens)/fuel-station";
import { useBranchData } from "@/hooks/use-branch-data";
import BranchHeader from "@/components/branches/branch-header";
import { Button } from "react-native-paper";

const Location = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { error, refetch, branches, loading } = useBranchData();

  const handleBranchSelection = (branchData: any) => {
    console.log("Selected branch with distance data:", {
      name: branchData.location_name || branchData.name,
      distance: branchData.calculatedDistance || branchData.distance,
      duration: branchData.calculatedDuration || branchData.duration,
    });
    setSelectedBranch(branchData);
  };

  // Optional: Show a loading skeleton screen only for the *first* load
  if (loading && branches.length === 0) {
    return <LocationSkeleton />;
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      {!selectedBranch ? (
        <>
          {error && (!branches || branches.length === 0) ? (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ textAlign: "center", color: "red", marginBottom: 10 }}>
                Something went wrong. Please try again.
              </Text>
              <Button onPress={refetch} mode="contained">Retry</Button>
            </View>
          ) : (
            <BranchHeader
              isSeleted={handleBranchSelection}
              error={error}
              refetch={refetch}
              branches={branches}
            />
          )}
        </>
      ) : (
        <FuelStationDetails
          data={selectedBranch}
          onBack={() => setSelectedBranch(null)}
        />
      )}
    </ScrollView>
  );
};

export default Location;
