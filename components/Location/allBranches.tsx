import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Title from "../General/Title";
import { theme } from "@/infrastructure/themes";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
const AllBranches = () => {
  const { t } = useTranslation();
  return (
    <View style={{width:wp("90%"),display:"flex",flexDirection:"column",gap:10}}>
      <Text
        style={{
          fontSize: theme.fontSize.medium,
          fontFamily: theme.fontFamily.semiBold,
          color: theme.colors.ui.black,
        }}
      >
       {t("All Branch")}
      </Text>
      <View style={styles.card}>
        <Image style={{width:wp('35%'),height:hp('12%')}}  source={require("@/assets/images/satgroups/branch.png")} />
        <View>
          <Text style={styles.place}>{t("Kormangala")}</Text>
          <Text style={styles.distance}>{t("2km away")}</Text>
          <View
            style={{
              width: wp('35%'),
              height: hp('5%'),
              borderRadius: 8,
              backgroundColor: theme.colors.brand.blue,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection:"row",
              gap:2
            }}
          >
            <Text
              style={{
                fontFamily: theme.fontFamily.semiBold,
                fontSize: hp(1.8),
                color: theme.colors.text.primary,
              }}
            >
              {" "}
             {t("Vist me")}
              
            </Text>
            <Ionicons name="arrow-forward" size={15} color="white" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AllBranches;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.ui.cardbg,
    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    flexDirection : "column",
    justifyContent: "space-around",
    alignItems: "center",
    padding: wp(5),
    width: wp("45%"),
  },
  place: {
    fontSize: hp(2.2),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
  },
  distance:{
    fontSize: hp(1.8),
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.secondary,
  }
});
