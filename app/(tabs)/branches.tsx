// 2. Updated Location.tsx - Enhanced to pass complete branch data
import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import LocationSkeleton from "@/components/skeleton/location/location-skeleton";
import FuelStationDetails from "../(screens)/fuel-station";
import { useBranchData } from "@/hooks/use-branch-data";
import BranchHeader from "@/components/branches/branch-header";

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

  if (loading) {
    return <LocationSkeleton />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {!selectedBranch ? (
        <BranchHeader 
          isSeleted={handleBranchSelection} 
          error={error} 
          refetch={refetch} 
          branches={branches} 
        />
      ) : (
        <View>
          <FuelStationDetails
            data={selectedBranch}
            onBack={() => setSelectedBranch(null)}
            // Now selectedBranch includes:
            // - calculatedDistance
            // - calculatedDuration
            // - userLocation
            // - all original branch data
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Location;