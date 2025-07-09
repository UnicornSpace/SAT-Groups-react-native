// UserDetailsContainer.tsx
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "@/infrastructure/themes";
import { Link } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { width, size, fontSize } from "react-native-responsive-sizes";
import CustomizedBadge from "./customized-badge";
import { SkeletonLoader } from "../skeleton/home/home-skeleton";
import { useTranslation } from "react-i18next";

const UserDetailsContainer = ({
  userInfo,
  isLoading,
}: {
  userInfo: { name?: string };
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const greeting = getGreetingMessage();

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <SkeletonLoader width={50} height={50} style={{ borderRadius: 25 }} />
          <View>
            <SkeletonLoader width={120} height={20} style={{ marginBottom: 5 }} />
            <SkeletonLoader width={80} height={15} />
          </View>
        </View>
        <SkeletonLoader width={80} height={40} />
      </View>
    );
  }

  if (!userInfo?.name) return null;

  return (
    <Link href="/(tabs)/profile" style={styles.userContainer}>
      <View style={styles.userRow}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
          <Text style={styles.cardText}>{t(greeting)}</Text>
          <Text style={styles.userNametext}>{userInfo.name}</Text>
        </View>
        <CustomizedBadge userInfo={userInfo.name?.charAt(0)} />
      </View>
    </Link>
  );
};

export default UserDetailsContainer;

const getGreetingMessage = () => {
  const hour = parseInt(
    new Date().toLocaleString("en-IN", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    })
  );

  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const styles = StyleSheet.create({
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: fontSize(10),
    color: theme.colors.text.secondary,
  },
  userNametext: {
    fontFamily: theme.fontFamily.medium,
    fontSize: fontSize(12),
    color: theme.colors.ui.black,
    marginTop: hp(-0.5),
  },
  userContainer: {
    width: width(90),
    backgroundColor: theme.colors.ui.screenbg,
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    paddingHorizontal: size(10),
    paddingVertical: hp(1.5),
  },
  skeletonContainer: {
    width: width(90),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
