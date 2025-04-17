import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomizedCard from "../General/card-container";
import { Badge } from "react-native-paper";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
const TranscationCard = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 11,
        }}
      >
        <View>
          <Image
            source={require("@/assets/images/satgroups/noxBlue-Logo.png")}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.heading}>{t("Nox Solution")}</Text>
          <Text style={styles.place}>{t("Perundurai")}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{t("9th march")}</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.points}>{t("+ 50")}</Text>
      </View>
    </View>
  );
};

export default TranscationCard;

const styles = StyleSheet.create({
  card: {
    width: wp("90%"),
    // height: hp("12%"),
    backgroundColor: "#F2F3F5",
    // boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: hp(1.5),
  },
  heading: {
    fontSize: hp("2.3%"),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
    
  },
  place: {
    fontSize: hp("1.6%"),
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.medium,
  },
  dateContainer: {
    borderRadius: 5,
    height: hp("3%"),
    width: wp("20%"),
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: hp("1.5%"),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  points: {
    fontSize: hp("3%"),
    color: theme.colors.brand.green,
    fontFamily: theme.fontFamily.bold,
  },
});
