import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { width, height, size, fontSize } from "react-native-responsive-sizes";
import { theme } from "@/infrastructure/themes";
import { useAuth } from "@/utils/auth-context";
import { t } from "i18next";
import axiosInstance from "@/utils/axions-instance";
import { useFocusEffect } from "expo-router";
const UserBentogrids = () => {
  const { driverId, token } = useAuth();
  const [points, setpoints] = useState("");
  const [referral_points, setreferral_points] = useState("");
  const driver_id = driverId;
  const usertoken = token;

  const getPoints = async () => {
    try {
      const response = await axiosInstance.post(
        "/driver-points.php",
        { driver_id, take: 20, skip: 0 },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );

      const referalResponse = await axiosInstance.post(
        "/user-details.php",
        { driver_id },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      const userPoints = response.data;
      setpoints(userPoints.total_points);
      setreferral_points(referalResponse.data.driver.referral_code);
      return userPoints.total_points;
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    getPoints();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getPoints(); // Automatically refetch on tab focus
    }, [])
  );
  return (
    <View
      style={{
        flexDirection: "row",
        // gap: hp(2),
        width: width(90),
        justifyContent: "space-between",
      }}
    >
      <View style={styles.box1}>
        <Text
          style={{
            fontSize: hp(3.2),
            fontFamily: theme.fontFamily.semiBold,
            textAlign: "center",
            color: theme.colors.brand.blue,
          }}
        >
          {Number(points).toFixed(2)}
        </Text>
        <Text
          style={{
            fontSize: hp(1.7),
            fontFamily: theme.fontFamily.regular,
            textAlign: "center",
            color: "#8E8F8F",
          }}
        >
          {t("Total Points")}
        </Text>
      </View>
      <View style={styles.box2}>
        <Text
          style={{
            fontSize: hp(3),
            fontFamily: theme.fontFamily.semiBold,
            textAlign: "center",
            color: theme.colors.brand.blue,
          }}
        >
          {referral_points}
        </Text>
        <Text
          style={{
            fontSize: hp(1.7),
            fontFamily: theme.fontFamily.regular,
            textAlign: "center",
            color: "#8E8F8F",
          }}
        >
          {t("Referal Code")}
        </Text>
      </View>
    </View>
  );
};

export default UserBentogrids;

const styles = StyleSheet.create({
  box1: {
    height: height(10),
    width: width(45),
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: "#D5D5D7",
    backgroundColor: theme.colors.ui.cardbg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box2: {
    height: height(10),
    width: width(39),
    borderRadius: 10,

    borderWidth: 0.7,
    borderColor: "#D5D5D7",
    backgroundColor: theme.colors.ui.cardbg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
