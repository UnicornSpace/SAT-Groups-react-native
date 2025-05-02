import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { width, height, size, fontSize } from "react-native-responsive-sizes";

const TransactionCard = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Image
          source={require("@/assets/images/satgroups/noxBlue-Logo.png")}
          style={styles.logo}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>{t("Nox Solution").trim()}</Text>
          <Text style={styles.place}>{t("Perundurai")}</Text>

          <View style={styles.dateContainer}>
            <Text style={styles.date}>{t("9th march")}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.points}>{t("+50")}</Text>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  card: {
    width: width(90),
    
    backgroundColor: "#F2F3F5",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: size(8),
    paddingHorizontal: size(10),
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: size(10),
  },
  logo: {
    width: width(14),
    // height: height(10),
    resizeMode: "contain",
  },
  detailsContainer: {
    flexDirection: "column",
    // gap: hp("-1%"),
  },
  heading: {
    fontSize: fontSize(13),
    // fontSize: hp("2.3%"),
    marginBottom: hp("-0.5%"),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
  },
  place: {
    // fontSize: hp("1.6%"),
    fontSize: fontSize(8),
    marginTop: hp("-0.5%"),
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
  },
  dateContainer: {
    borderRadius: 5,
    width: size(70),
    backgroundColor: theme.colors.brand.blue,
    paddingVertical: size(2),
    // paddingHorizontal: hp("0.1%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: size(4),
  },
  date: {
    fontSize: size(8),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  points: {
    fontSize: size(15),
    color: theme.colors.brand.green,
    fontFamily: theme.fontFamily.medium,
  },
});
