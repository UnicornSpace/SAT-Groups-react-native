import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { theme } from "@/infrastructure/themes";
import { router } from "expo-router";
import { useAuth } from "@/utils/AuthContext";
import axiosInstance from "@/utils/axionsInstance";
import { t } from "i18next";

const RedeemPointsScreen: React.FC = () => {
  const { token, driverId } = useAuth();
  const [Points, setPoints] = useState("");
  useEffect(() => {
    const driver_id = driverId;
    const usertoken = token;

    const getPoints = async () => {
      try {
        const response = await axiosInstance.post(
          "/driver-points.php",
          { driver_id, take: 10, skip: 0 },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const userPoints = response.data;
        setPoints(userPoints.total_points);

        return userPoints.total_points;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPoints();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)");
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("Redeem Points")}</Text>
      </View>

      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Background Image */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={require("@/assets/images/satgroups/gift.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <Text style={styles.title}>{t("Redeem Points")}</Text>
        <Text style={styles.description}>
          {
            t(`You have ${Math.ceil(Number(Points) || 0)} points available to redeem.`)
          }
        </Text>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/location")}
            style={styles.redeemButton}
          >
            <Text style={styles.buttonText}>{t("Check the nearest Branch")}</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    fontFamily: theme.fontFamily.regular,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  headerTitle: {
    color: "#111418",
    fontSize: 18,
    fontFamily: theme.fontFamily.bold,
    lineHeight: 24,
    textAlign: "center",
    flex: 1,
  },

  imageContainer: {
    width: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: 218,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  title: {
    color: theme.colors.brand.blue,
    fontSize: 22,
    fontFamily: theme.fontFamily.bold,
    lineHeight: 28,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  description: {
    color: "#111418",
    fontSize: 15,
    fontFamily: theme.fontFamily.regular,
    // lineHeight: 24,
    paddingBottom: 12,
    // paddingTop: 4,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  redeemButton: {
    minWidth: 84,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: theme.fontFamily.semiBold,
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 20,
    backgroundColor: "white",
    marginTop: "auto",
  },
});

export default RedeemPointsScreen;
