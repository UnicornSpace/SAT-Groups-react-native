import { Alert, ScrollView, StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Title from "@/components/General/Title";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import { useAuth } from "@/utils/AuthContext";
import NearBranchList from "@/components/Location/nearBranchList";
import AllBranches from "@/components/Location/allBranches";
import LocationSkeleton from "@/components/skeleton/location/location-skeleton";
import axios from "axios";





const Location = () => {
  const { t } = useTranslation();
  const [getBranches, setgetBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, driverId } = useAuth();

  useEffect(() => {
    const driver_id = driverId;
    const usertoken = token;
    const getBranchesList = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/get-location.php",
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const Branches = response.data;
        setgetBranches(Branches.data);
        setLoading(false);
        // console.log("User Details😑😑:", Branches.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    getBranchesList();
  }, []);

  if (loading) {
    return <LocationSkeleton />;
  }




  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Title>{t("Our Branches").trim()}</Title>
          <Text style={styles.description}>
            {t("Find the branches near you")}
          </Text>
        </View>
    
        <NearBranchList />
        <AllBranches branch={getBranches} />
        {/* <GoogleMapLocation/> */}
      </View>
    </ScrollView>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    // height: hp('100%'),
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
  input: {
    width: wp("89%"),
    height: hp(6.5),
    backgroundColor: theme.colors.ui.screenbg,
    fontFamily: theme.fontFamily.medium,
    borderRadius: 8,
    borderColor: "#C5C5C5",
    color: theme.colors.ui.black,
    // boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
  },
});