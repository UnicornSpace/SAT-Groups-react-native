import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Title from "../General/Title";
import { theme } from "@/infrastructure/themes";

const Branches = () => {
  return <View style={styles.card}>
    <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:8}}>
    <Image source={require("@/assets/images/satgroups/LocationLogo.png")} />
    <Text style={{fontFamily:theme.fontFamily.semiBold,fontSize:18}}>Salem</Text>
    </View>
    <View style={{display:"flex",flexDirection:"row",alignItems:"flex-end",gap:22}}>
    <Text style={{fontFamily:theme.fontFamily.medium,fontSize:16}}>6 KM</Text>
    <Text style={{fontFamily:theme.fontFamily.medium,fontSize:16}}>1 hrs</Text>
    </View>
  </View>;
};

const NearBranchList = () => {
  return (
    <View>
      {/* Heading */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Title style={styles.h1}>Nearest Branch</Title>
        <View
          style={{
            width: 84,
            height: 29,
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
            Near me
          </Text>
        </View>
      </View>
      {/* Branches List */}
      <Branches />
    </View>
  );
};

export default NearBranchList;

const styles = StyleSheet.create({
  h1: {
    fontSize: 17,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.ui.black,
    textAlign: "center",
  },
  card: {
    width: 325,
    height: 64,
    backgroundColor: "#F2F3F5",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
    borderLeftWidth: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 17,
  },
});
