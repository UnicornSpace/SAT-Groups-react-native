// TransactionCard.tsx
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { width, height, size, fontSize } from "react-native-responsive-sizes";

interface TransactionCardProps {
  companyName: string;
  date: string;
  points: string;
  transactionType: string;
}

const TransactionCard = ({
  companyName ,
  date ,
  points ,
  transactionType ,
}: TransactionCardProps) => {
  const { t } = useTranslation();

  // Determine if points are positive or negative
  const isPositive = !points.startsWith("-");

  // Set color based on transaction type
  const pointsColor = isPositive
    ? theme.colors.brand.green
    : theme.colors.brand.red || "#FF4D4F";
// const location = companyName.split("-")[1];
// const Name = companyName.split("-")[0];
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Image
          source={require("@/assets/images/satgroups/nox-blue-logo.png")}
          style={styles.logo}
        />

        <View style={styles.detailsContainer}>
          {/* <Text style={styles.heading}>{t(Name).trim()}</Text> */}
          <Text style={styles.heading}>{t(companyName).trim()}</Text>
          {/* <Text style={styles.place}>{t(location)}</Text> */}

          <View style={styles.dateContainer}>
            <Text style={styles.date}>{t(date)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.points, { color: pointsColor }]}>{t(points)}</Text>
        <Text style={styles.transactionType}>{t(transactionType)}</Text>
      </View>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F3F5",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: size(8),
    width: width(90),
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",

    gap: size(10),
  },
  logo: {
    width: width(14),
    resizeMode: "contain",
  },
  detailsContainer: {
    flexDirection: "column",
  },
  heading: {
    fontSize: fontSize(13),
    marginBottom: hp("-0.5%"),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
  },
  place: {
    fontSize: fontSize(8),
    marginTop: hp("-0.5%"),
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.medium,
  },
  dateContainer: {
    borderRadius: 5,
    width: size(50),
    backgroundColor: theme.colors.brand.blue,
    paddingVertical: size(2),
    justifyContent: "center",
    alignItems: "center",
    marginTop: size(4),
  },
  date: {
    fontSize: size(8),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  points: {
    fontSize: size(15),
    fontFamily: theme.fontFamily.medium,
  },
  transactionType: {
    fontSize: fontSize(8),
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
    marginTop: 2,
  },
});
