import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import ReferralSteps from "@/components/Profile/referalSteps";
import { width, height, size, fontSize } from "react-native-responsive-sizes";
const ReferalCard = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/(screens)/ReferalScreen");
      }}
      style={styles.container}
    >
      <View style={{ flexDirection: "row", gap: hp(8), alignItems: "center",justifyContent:"space-between" ,width:width(82)}}>
        <View
          style={{
            flexDirection: "row",
            gap: hp(2),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="people" size={20} color={theme.colors.brand.blue} />
          <Text style={{ fontSize: 16, fontFamily: theme.fontFamily.regular }}>
            Refer your friend
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default ReferalCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: "#D5D5D7",
    backgroundColor: theme.colors.ui.cardbg,
    display: "flex",
  
  },
});
