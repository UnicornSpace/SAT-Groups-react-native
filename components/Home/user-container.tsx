import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomizedCard from "../General/card-container";
import { Badge } from "react-native-paper";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
const UserContainer = () => {
    const { t } = useTranslation();
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
          <Text style={styles.cardText}>{t("welcome_message")}</Text>
          <Text style={styles.userNametext}>Sachin</Text>
        </View>
        <View>
          <Badge style={styles.badge}>S</Badge>
        </View>
      </View>
    </View>
  );
};

export default UserContainer;

const styles = StyleSheet.create({
  cardText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: hp("1.65%"),
    color: theme.colors.text.secondary,
  },
  userNametext: {
    fontFamily: theme.fontFamily.semiBold,
    fontSize: hp("2.5%"),
    color: theme.colors.ui.black,
  },
  badge: {
    width: wp("10%"),
    height: hp("5%"),
    borderRadius: 50,
    backgroundColor: theme.colors.brand.blue,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
    fontSize: hp("2.5%"),
    lineHeight: 40,
  },
  userContainer: {
    width: wp("90%"),
    height: hp(9),
    backgroundColor: theme.colors.ui.screenbg,
    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.10)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(1.5),
  },
});
