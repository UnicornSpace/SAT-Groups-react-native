import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/infrastructure/themes";
import { Link, useFocusEffect } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { width, size, fontSize } from "react-native-responsive-sizes";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axions-instance";
import CustomizedBadge from "./customized-badge";
import { useAuth } from "@/utils/auth-context";
import { t } from "i18next";
import { SkeletonLoader } from "../skeleton/home/home-skeleton";

const UserDetailsContainer = () => {
  const { token, driverId } = useAuth();
  const [userInfo, setuserInfo] = useState<{ id?: number; name?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
const driver_id = driverId;
    const userToken = token;

    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.post(
          "/user-details.php",
          { driver_id },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const userDetails = response.data;
        setuserInfo(userDetails.driver);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

  useEffect(() => {
    
    getUserDetails();
  }, []);
   useFocusEffect(
    React.useCallback(() => {
      getUserDetails(); // Automatically refetch on tab focus
    }, [])
  );
  const { t } = useTranslation();
  const greeting = getGreetingMessage();

  if (isLoading) {
    return (
      <View
        style={{
          width: width(90),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <SkeletonLoader width={50} height={50} style={{ borderRadius: 25 }} />
          <View>
            <SkeletonLoader
              width={120}
              height={20}
              style={{ marginBottom: 5 }}
            />
            <SkeletonLoader width={80} height={15} />
          </View>
        </View>
        <SkeletonLoader width={80} height={40} />
      </View>
    );
  }

  return (
    <Link href="/(tabs)/profile" style={styles.userContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.cardText}>{t(greeting)}</Text>
          <Text style={styles.userNametext}>{userInfo.name}</Text>
        </View>
        <View>
          <CustomizedBadge userInfo={userInfo.name?.charAt(0)} />
          {/* <Badge size={30} style={styles.badge}>{userInfo.name?.charAt(0)}</Badge> */}
        </View>
      </View>
    </Link>
  );
};

export default UserDetailsContainer;

const getGreetingMessage = () => {
  const currentHour = new Date().toLocaleString("en-IN", {
    hour: "numeric",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const hour = parseInt(currentHour);

  if (hour >= 5 && hour < 12) {
    return t("Good Morning");
  } else if (hour >= 12 && hour < 17) {
    return t("Good Afternoon");
  } else {
    return t("Good Evening");
  }
};

const styles = StyleSheet.create({
  cardText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: fontSize(10),
    color: theme.colors.text.secondary,
  },
  userNametext: {
    fontFamily: theme.fontFamily.medium,
    // fontSize: hp("2.5%"),
    fontSize: fontSize(12),
    color: theme.colors.ui.black,
    marginTop: hp(-0.5),
  },
  badge: {
    backgroundColor: theme.colors.brand.blue,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
    fontSize: fontSize(14),
    textAlign: "center",
  },
  userContainer: {
    width: width(90),

    backgroundColor: theme.colors.ui.screenbg,
    // boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.10)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    paddingHorizontal: size(10),
    paddingVertical: hp(1.5),
  },
});
