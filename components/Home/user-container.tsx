import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomizedCard from "../General/card-container";
import { Badge } from "react-native-paper";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { width, height, size, fontSize } from "react-native-responsive-sizes";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import CustomizedBadge from "./CustomizedBadge";
const getGreetingMessage = () => {
  const currentHour = new Date().toLocaleString("en-IN", {
    hour: "numeric",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const hour = parseInt(currentHour);

  if (hour >= 5 && hour < 12) {
    return "Good Morning ";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon ";
  } else {
    return "Good Evening ";
  }
};

console.log(getGreetingMessage(), "currentHour");
const UserContainer = () => {
  const [userInfo, setuserInfo] = useState<{ id?: number; name?: string }>({});
  useEffect(() => {
    const driver_id = 2;
    const token =
      "8ef3cf4ed84148e6a5c9faa3267a0acf57f7320703fd7644785a16342a41e7e2";

    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.post(
          "/user-details.php",
          { driver_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userDetails = response.data;
        setuserInfo(userDetails.driver);
        console.log("User Details:", userDetails.driver);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);
  const { t } = useTranslation();
  const greeting = getGreetingMessage();
  return (
    <View style={styles.userContainer}>
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
          <CustomizedBadge userInfo={userInfo.name?.charAt(0)}/>
          {/* <Badge size={30} style={styles.badge}>{userInfo.name?.charAt(0)}</Badge> */}
        </View>
      </View>
    </View>
  );
};

export default UserContainer;

const styles = StyleSheet.create({
  cardText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: fontSize(11),
    // fontSize: hp("1.65%"),
    color: theme.colors.text.secondary,
  },
  userNametext: {
    fontFamily: theme.fontFamily.medium,
    // fontSize: hp("2.5%"),
    fontSize: fontSize(16),
    color: theme.colors.ui.black,
    marginTop: hp(-0.6),
  },
  badge: {
    
    backgroundColor: theme.colors.brand.blue,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
    fontSize: fontSize(16),
    textAlign: "center",
  },
  userContainer: {
    width: wp("90%"),
    // height: hp(9),
    // width:width(90),
    // height: height(8),
    backgroundColor: theme.colors.ui.screenbg,
    // boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.10)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(1.5),
  },
});
