import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/infrastructure/themes";
import { Button } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { width, height, size, fontSize } from "react-native-responsive-sizes";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import { useAuth } from "@/utils/AuthContext";
import { router } from "expo-router";
const BannerContainer = () => {
  
  const { t } = useTranslation();
  const [Points, setPoints] = useState("");
  const {token, driverId} = useAuth()
  const { myDynamicPoints, setMyDynamicPoints } = useAuth();
  useEffect(() => {
    const driver_id = driverId;
    const usertoken =token

    const getPoints = async () => {
      try {
        const response = await axiosInstance.post(
          "/driver-points.php",
          { driver_id, take: 10, skip: 0 },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const userPoints = response.data;
        setPoints(userPoints.total_points);
        setMyDynamicPoints(Math.ceil(Number(userPoints.total_points) || 0));  
        // console.log("User Details:", userPoints.total_points);
        return userPoints.total_points;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPoints();
  }, []);
  return (
    <View style={{ position: "relative" }}>
      <Image
        style={{ width: width(90), height: height(18) }}
        source={require("../../assets/images/satgroups/banner.png")}
        resizeMode="stretch"
      />
      <View style={{ position: "absolute", top: size(28), left: size(22) }}>
        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
          <Text style={styles.bannerText}>{t("Total Points")}</Text>
          <Text style={styles.pointsText}>{Math.ceil(Number(Points) || 0)}</Text>

        </View>
        <TouchableOpacity onPress={()=>router.push("/(screens)/redeem-navigate")} style={styles.bannerBtn}>
          <Text
            style={{
              fontFamily: theme.fontFamily.semiBold,
              // fontSize: hp("1.8%"),
              fontSize: fontSize(12),
              color: theme.colors.brand.red,
            }}
          >
            {t("Redeem")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BannerContainer;

const styles = StyleSheet.create({
  bannerText: {
    fontSize: fontSize(15),
    // fontSize: hp("2.2%"),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
    marginBottom: hp(-1),
  },
  pointsText: {
    // fontSize: hp("3.8%"),
    fontSize: fontSize(22),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.semiBold,
  },
  bannerBtn: {
    width: width(25),
    height: height(4),
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.ui.screenbg,
  },
});
