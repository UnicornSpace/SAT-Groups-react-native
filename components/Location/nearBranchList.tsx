import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Title from "../General/Title";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

const Branches = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Image source={require("@/assets/images/satgroups/LocationLogo.png")} />
        <Text
          style={{ fontFamily: theme.fontFamily.semiBold, fontSize: hp(2.4) }}
        >
          {t("Salem")}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 22,
        }}
      >
        <Text style={{ fontFamily: theme.fontFamily.medium, fontSize:hp(2) }}>
          {t("6 KM")}
        </Text>
        <Text style={{ fontFamily: theme.fontFamily.medium, fontSize:hp(2) }}>
          {t("1 hrs")}
        </Text>
      </View>
    </View>
  );
};

const NearBranchList = () => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: wp("90%"),
      }}
    >
      {/* Heading */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: wp("90%"),
        }}
      >
        <Title style={styles.h1}>{t("Nearest Branch")}</Title>
        <TouchableOpacity
          style={{
            width: wp(24),
            height: hp(4),
            borderRadius: 8,
            backgroundColor: theme.colors.brand.blue,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily.semiBold,
              fontSize: hp(1.8),
              color: theme.colors.text.primary,
            }}
          >
            {" "}
            {t("Near me")}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Branches List */}
      <Branches />
    </View>
  );
};

export default NearBranchList;

const styles = StyleSheet.create({
  h1: {
    fontSize: 17,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.ui.black,
    textAlign: "center",
  },
  card: {
    width: wp("90%"),
    height: hp(8),
    backgroundColor: "#F2F3F5",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
    borderLeftWidth: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 17,
  },
});
