import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome } from "@expo/vector-icons";
import { theme } from "@/infrastructure/themes";
import { useTranslation } from "react-i18next";
import LanguageSelection from "../Home/lang-dropdown";
const LanguageSetting = () => {
  const { t } = useTranslation();
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: wp(85),
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: hp(2.5), fontFamily: theme.fontFamily.medium }}
        >
          {t("Account Settings")}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row", 
          justifyContent: "space-between",
          width: wp(85),
          alignItems: "center",
          marginTop: hp(0.5),
        }}
      >
        <View style={{ display: "flex", flexDirection: "row",justifyContent:"center", alignItems: "center",gap:wp(4), }}>
          <TouchableOpacity style={styles.userbtn}>
            {/* <Ionicons name="pencil" size={20} color="black" /> */}
            <FontAwesome
              name="user"
              size={20}
              color={theme.colors.brand.blue}
            />
            {/* <FontAwesome5 name="user" size={16} color={theme.colors.brand.blue} /> */}
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: theme.fontFamily.semiBold,
              fontSize: hp(2.3),
              color: theme.colors.brand.blue,
            }}
          >
            Language
          </Text>
        </View>
        <LanguageSelection/>
      </View>
    </View>
  );
};

export default LanguageSetting;

const styles = StyleSheet.create({
  container: {
    width: wp(85),
    display: "flex",
    flexDirection: "column",

    gap: hp(2),
  },
  editbtn: {
    backgroundColor: "#F2F3F5",
    borderRadius: 100,
    width: wp(12),
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  userbtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    width: wp(13),
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
