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
const AllBranches = ({ branch }: any) => {
  const { t } = useTranslation();
  // console.log("branch", branch && branch.length > 0 ? branch[0].brand : "No branch data");
  const sentenceCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, match => match.toUpperCase());
  };
  if (!branch || branch.length === 0) {
    return (
      <View style={{ width: wp("90%"), alignItems: "center", padding: 20 }}>
        <Text>No branch data available</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        width: wp("90%"),
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Text
        style={{
          fontSize: theme.fontSize.medium,
          fontFamily: theme.fontFamily.medium,
          color: theme.colors.ui.black,
        }}
      >
        {t("All Branch")}
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
      {branch.map((item: any) => {
        return (
          <View
            key={item.id}
            style={{
              display: "flex",
              gap: 4,
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: wp("30%"),
  
            }}
          >
            <Image
              style={{ width: wp("25%"), height: hp("12%"), borderRadius: 100 }}
              source={require("@/assets/images/satgroups/branch.png")}
            />
            <View
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.semiBold,
                  fontSize: 14,
                  color: theme.colors.brand.blue,
                  textAlign: "center",
                  lineHeight: 20,

                }}
              >
                {sentenceCase(item.location_name)}
              </Text>
              {/* <Text
                style={{
                  fontFamily: theme.fontFamily.medium,
                  fontSize: 14,
                  color: theme.colors.text.secondary,
                }}
              >
                252 Km
              </Text> */}
            </View>
          </View>
        );
      })}
      </View>
      {/* <View style={styles.card}>
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
      </View> */}
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
    flexDirection: "column",
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
  distance: {
    fontSize: hp(1.8),
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
});
