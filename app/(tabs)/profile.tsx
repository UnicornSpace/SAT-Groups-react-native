import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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
const profile = () => {
  const [address, setaddress] = useState("");
  const logot = () => {
    router.push("/(screens)/LanguageSeletionScreen");
  };
  const { t } = useTranslation();
  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image
            source={require("@/assets/images/satgroups/profilePic.png")}
            resizeMode="cover"
            width={wp("25%")}
            height={hp("12%")}
          />
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
              Sachin
            </Text>

            <LinearGradient
              colors={["#4A86D2", theme.colors.brand.blue]}
              style={styles.gradient}
            >
              <Text style={styles.date}>{t("Driver ID : 1063")}</Text>
            </LinearGradient>
          </View>
        </View>
        <UserBentogrids />
        <UserDetails />

        <LanguageSetting />
        <TouchableOpacity onPress={logot} style={styles.btn}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.semiBold,
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
    gap: 25,
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    height: "100%",
    width: "90%",
    alignContent: "center",
    // backgroundColor: theme.colors.ui.screenbg,
  },
  gradient: {
    paddingVertical: hp(1),
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
    height: hp(7),
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
