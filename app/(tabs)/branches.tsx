import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import LocationSkeleton from "@/components/skeleton/location/location-skeleton";
import FuelStationDetails from "../(screens)/fuel-station";
import { useBranchData } from "@/hooks/use-branch-data";
import BranchHeader from "@/components/branches/branch-header";

const Location = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
const {  error,refetch,branches,loading} = useBranchData();
  if (loading) {
    return <LocationSkeleton  />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {!selectedBranch ? (
        <BranchHeader isSeleted={setSelectedBranch} error={error} refetch={refetch} branches={branches} />
      ) : (
        <View>
          <FuelStationDetails
            data={selectedBranch}
            onBack={() => setSelectedBranch(null)}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Location;

