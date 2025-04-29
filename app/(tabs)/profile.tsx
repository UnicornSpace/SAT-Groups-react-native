import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/infrastructure/themes";
import Button from "@/components/General/button";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import UserBentogrids from "@/components/Profile/bentogrids";
import UserDetails from "@/components/Profile/UserDetails";
import LanguageSetting from "@/components/Profile/languageSetting";
import axiosInstance from "@/utils/axionsInstance";
import ReferalCard from "@/components/Profile/referalCard";
import { Badge } from "react-native-paper";
import EditButton from "@/components/Profile/edit";

const profile = () => {
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

  const logot = () => {
    router.push("/(screens)/LanguageSeletionScreen");
  };
  const { t } = useTranslation();

  return (
    <ScrollView>
      <View style={styles.container}>
      
        <View>
          {/* <Image
            source={require("@/assets/images/satgroups/profilePic.png")}
            resizeMode="cover"
            width={wp("25%")}
            height={hp("12%")}
          /> */}
          <View>
            <Badge
              style={{
                width: wp("31%"),
                height: hp("15%"),
                borderRadius: 100,
                backgroundColor: theme.colors.brand.blue,
                color: theme.colors.text.primary,
                fontFamily: theme.fontFamily.bold,
                fontSize: hp("5%"),
                lineHeight: 40,
              }}
            >
              {userInfo.name?.charAt(0)}
            </Badge>
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
              style={{ fontSize: hp(3), fontFamily: theme.fontFamily.semiBold }}
            >
              {userInfo.name}
            </Text>

            <LinearGradient
              colors={["#4A86D2", theme.colors.brand.blue]}
              style={styles.gradient}
            >
              <Text style={styles.date}>{t(`Driver ID : ${userInfo.id}`)}</Text>
            </LinearGradient>
          </View>
        </View>

        <UserBentogrids />
        <ReferalCard />
        <UserDetails data={userInfo} />

        <LanguageSetting />
        <TouchableOpacity onPress={logot} style={styles.btn}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.medium,
              fontSize: hp(2.5),
            }}
          >
            {t("LogOut")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: hp(2.5),
    marginVertical: hp(2.5),
    alignItems: "center",
    gap:18,
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    height: "100%",
    width: "90%",
    alignContent: "center",
    // backgroundColor: theme.colors.ui.screenbg,
  },
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
    // paddingHorizontal: hp("2%"),
  },
});
