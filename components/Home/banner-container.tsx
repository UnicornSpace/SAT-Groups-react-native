import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "@/infrastructure/themes";
import { Button } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
const BannerContainer = () => {
  const { t } = useTranslation();
  return (
    <View style={{ position: "relative" }}>
      <Image
        style={{ width: wp("90%"), height: hp("22%") }}
        source={require("../../assets/images/satgroups/banner.png")}
        resizeMode="stretch"
      />
      <View style={{ position: "absolute", top: hp(4), left: wp(6) }}>
        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
          <Text style={styles.bannerText}>{t("TOTAL POINTS")}</Text>
          <Text style={styles.pointsText}>450</Text>
        </View>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text
            style={{
              fontFamily: theme.fontFamily.bold,
              fontSize: hp("1.8%"),
              color: theme.colors.brand.red,
            }}
          >
            {" "}
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
    fontSize: hp("2.2%"),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.semiBold,
  },
  pointsText: {
    fontSize: hp("3.8%"),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
  },
  bannerBtn: {
    width: wp("23%"),
    height: hp("4.5%"),
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.ui.screenbg,
  },
});
