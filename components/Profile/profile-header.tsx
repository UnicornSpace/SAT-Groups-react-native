import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "@/infrastructure/themes";
import { size, fontSize } from "react-native-responsive-sizes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const ProfileHeader = ({ userInfo }: any) => {
  const { t } = useTranslation();
  
  // Handle missing or empty user data
  if (!userInfo || !userInfo.name) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyBadge}>
          <Text style={styles.emptyBadgeText}>?</Text>
        </View>
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyNameText}>{t("User Not Found")}</Text>
          <LinearGradient
            colors={["#cccccc", "#999999"]}
            style={styles.gradient}
          >
            <Text style={styles.date}>{t("No User Data Available")}</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <View style={styles.badge}>
            <Text
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.fontFamily.semiBold,
                fontSize: fontSize(32),
              }}
            >
              {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ 
              fontSize: hp(3), 
              fontFamily: theme.fontFamily.semiBold,
              color: theme.colors.ui.black
            }}
          >
            {userInfo.name}
          </Text>

          <LinearGradient
            colors={["#4A86D2", theme.colors.brand.blue]}
            style={styles.gradient}
          >
            <Text style={styles.date}>
              {t(`Driver ID : ${userInfo.id || "N/A"}`)}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: hp(0.45),
    paddingHorizontal: hp(2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  dateContainer: {
    borderRadius: 5,
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: hp(1.5),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  btn: {
    backgroundColor: theme.colors.brand.blue,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp(90),
    paddingVertical: hp(1.2),
  },
  input: {
    height: hp("7%"),
    width: wp("90%"),
    borderWidth: 0.2,
    boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    borderRadius: 5,
    borderColor: theme.colors.brand.blue,
  },
  badge: {
    width: size(100),
    height: size(100),
    borderRadius: 50,
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // Empty state styles
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyBadge: {
    width: size(100),
    height: size(100),
    borderRadius: 50,
    backgroundColor: "#cccccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBadgeText: {
    color: "#666666",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: fontSize(32),
  },
  emptyTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyNameText: {
    fontSize: hp(3),
    fontFamily: theme.fontFamily.semiBold,
    color: "#666666",
  },
});