import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Title from "../General/Title";
import { theme } from "@/infrastructure/themes";
import { Ionicons } from "@expo/vector-icons";

const AllBranches = () => {
  return (
    <View>
      <Text
        style={{
          fontSize: theme.fontSize.medium,
          fontFamily: theme.fontFamily.semiBold,
          color: theme.colors.ui.black,
        }}
      >
        Our Branch
      </Text>
      <View style={styles.card}>
        <Image  source={require("@/assets/images/satgroups/branch.png")} />
        <View>
          <Text style={styles.place}>Kormangala</Text>
          <Text style={styles.distance}>2km away</Text>
          <View
            style={{
              width: 80,
              height: 40,
              borderRadius: 8,
              backgroundColor: theme.colors.brand.blue,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: theme.fontFamily.semiBold,
                fontSize: theme.fontSize.caption,
                color: theme.colors.text.primary,
              }}
            >
              {" "}
              Vist me 
              <Ionicons name="chevron-forward" size={16} color="white" />{" "}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AllBranches;

const styles = StyleSheet.create({
  card: {
    width: 325,
    height: 137,
    backgroundColor: theme.colors.ui.cardbg,
    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    flexDirection : "row",
    justifyContent: "space-around",
    alignItems: "center",
    // padding: 20,
  },
  place: {
    fontSize: 18,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
  },
  distance:{
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.secondary,
  }
});
