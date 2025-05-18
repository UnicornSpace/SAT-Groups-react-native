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

// Skeleton Component
const SkeletonLoader = ({ width, height, style }:any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: "#E0E0E0",
          borderRadius: 8,
          opacity: opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton for the Location screen
const LocationSkeleton = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Title and Description Skeleton */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <SkeletonLoader width={180} height={30} style={{ marginBottom: 8 }} />
          <SkeletonLoader width={250} height={18} />
        </View>

        {/* Near Branch List Skeleton */}
        <View style={{ width: "100%" }}>
          <SkeletonLoader width={150} height={22} style={{ marginBottom: 10 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 12, paddingVertical: 5 }}>
              {[1, 2, 3].map((_, index) => (
                <SkeletonLoader
                  key={index}
                  width={wp(42)}
                  height={hp(22)}
                  style={{ borderRadius: 12 }}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* All Branches Skeleton */}
        <View style={{ width: "100%" }}>
          <SkeletonLoader width={150} height={22} style={{ marginBottom: 10 }} />
          <View style={{ gap: 15, width: "100%" }}>
            {[1, 2, 3, 4].map((_, index) => (
              <SkeletonLoader
                key={index}
                width="100%"
                height={hp(12)}
                style={{ borderRadius: 12 }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

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