import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
    width: wp("90%"),
    backgroundColor: "#F2F3F5",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(1.8),
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: wp("3%"),
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  detailsContainer: {
    flexDirection: "column",
    gap: hp("-1%"),
  },
  heading: {
    fontSize: hp("2.3%"),
    marginBottom: hp("-0.5%"),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
  },
  place: {
    fontSize: hp("1.6%"),
    marginTop: hp("-0.5%"),
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
  },
  dateContainer: {
    borderRadius: 5,
    width: wp("20%"),
    backgroundColor: theme.colors.brand.blue,
    paddingVertical: hp("0.2%"),
    // paddingHorizontal: hp("0.1%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("0.5%"),
  },
  date: {
    fontSize: hp("1.3%"),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  points: {
    fontSize: hp("2.2%"),
    color: theme.colors.brand.green,
    fontFamily: theme.fontFamily.medium,
  },
});
