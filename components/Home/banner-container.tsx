import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "@/infrastructure/themes";
import { Button } from "react-native-paper";

const BannerContainer = () => {
  return (
    <View style={{ position: "relative" }}>
      <Image
        style={{ width: 325, height: 162, }}
        source={require("../../assets/images/satgroups/banner.png")}
        resizeMode="stretch"
      />
      <View style={{ position: "absolute", top: 30,left: 20 }}>
        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
          <Text style={styles.bannerText}>TOTAL POINTS</Text>
          <Text style={styles.pointsText}>450</Text>
        </View>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text
            style={{
              fontFamily: theme.fontFamily.bold,
              fontSize: theme.fontSize.caption,
              color: theme.colors.brand.red,
             
            }}
          >
            {" "}
            Redeem
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BannerContainer;

const styles = StyleSheet.create({
  bannerText: {
    fontSize: theme.fontSize.p,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.semiBold,
  },
  pointsText: {
    fontSize: theme.fontSize.h3,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
  },
  bannerBtn: {
    width: 80,
    height: 30,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.ui.screenbg,

  },
});
