import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "@/infrastructure/themes";
import Button from "@/components/General/button";
import { router } from "expo-router";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const profile = () => {
  const logot = () => {
    router.push("/(screens)/LanguageSeletionScreen");
  };
  return (
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
          <Text style={{ fontSize: hp(3), fontFamily: theme.fontFamily.semiBold }}>
            Sachin
          </Text>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>Driver ID : 1063</Text>
          </View>
        </View>
      </View>
      <View></View>
      <TouchableOpacity onPress={logot} style={styles.btn}><Text style={{color:theme.colors.text.primary,fontFamily:theme.fontFamily.semiBold,fontSize:hp(2.5)}}>LogOut</Text></TouchableOpacity>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: hp(2.5),
    marginVertical: hp(2.5),
    alignItems: "center",
    gap: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "90%",
    alignContent: "center",
  },
  dateContainer: {
    borderRadius: 5,
    paddingVertical: hp(0.5),
    paddingHorizontal: hp(1),
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp(90),
    height: hp(7), 
  },

});
