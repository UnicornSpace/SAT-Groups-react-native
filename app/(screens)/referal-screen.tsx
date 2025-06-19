import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Svg, { Path } from "react-native-svg";
import { theme } from "@/infrastructure/themes";
import { Button } from "react-native-paper";
import RefferalSteps from "@/components/profile/refferal-steps";
import { t } from "i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { size } from "react-native-responsive-sizes";

const ReferalScreen = (props: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />

      {/* Enhanced Header */}
      <LinearGradient
        colors={["#1a365d", "#2d5a87", "#4a90c2"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("Refer and earn 100 points")}
          </Text>
          {/* <View style={{ width: 40,backgroundColor:"red" }} /> */}
        </View>
      </LinearGradient>
      <View style={styles.subContainer}>
        <RefferalSteps />
      </View>
    </View>
  );
};

export default ReferalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#36629A",
  },
  subContainer: {
    width: wp(100),
    height: hp(84),
    maxHeight: hp(105),
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // height: hp(100) * 0.25,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    // justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: size(18),
    fontFamily: theme.fontFamily.semiBold,
    color: "white",
    textAlign: "center",
  },
});
