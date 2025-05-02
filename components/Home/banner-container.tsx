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
const BannerContainer = () => {
  const { t } = useTranslation();
  const [Points, setPoints] = useState("");
  useEffect(() => {
    const driver_id = 2;
    const token =
      "8ef3cf4ed84148e6a5c9faa3267a0acf57f7320703fd7644785a16342a41e7e2";

    const getPoints = async () => {
      try {
        const response = await axiosInstance.post(
          "/driver-points.php",
          { driver_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userPoints = response.data;
        setPoints(userPoints);
        console.log("User Details:", userPoints);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPoints();
  }, []);
  return (
    <View style={{ position: "relative" }}>
      <Image
        style={{ width: width(90), height: height(20) }}
        source={require("../../assets/images/satgroups/banner.png")}
        resizeMode="stretch"
      />
      <View style={{ position: "absolute", top: size(15), left: size(22) }}>
        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
          <Text style={styles.bannerText}>{t("Total Points")}</Text>
          <Text style={styles.pointsText}>{t("450")}</Text>
        </View>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text
            style={{
              fontFamily: theme.fontFamily.medium,
              // fontSize: hp("1.8%"),
              fontSize: fontSize(10),
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
