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
import axiosInstance from "@/utils/axions-instance";
import { useAuth } from "@/utils/auth-context";
import { router, useFocusEffect } from "expo-router";
import { SkeletonLoader } from "../skeleton/home/home-skeleton";
const BannerContainer = ({ points }: { points: number | null }) => {
  const { t } = useTranslation();

  if (points === null) {
    return <SkeletonLoader width={width(90)} height={180} />;
  }

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
          <Text style={styles.pointsText}>{points.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(screens)/redeem-navigate")}
          style={styles.bannerBtn}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily.semiBold,
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
