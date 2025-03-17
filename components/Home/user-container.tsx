import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomizedCard from "../General/card-container";
import { Badge } from "react-native-paper";
import { theme } from "@/infrastructure/themes";

const UserContainer = () => {
  return (
    <View style={styles.userContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.cardText}>Welcome back,</Text>
          <Text style={styles.userNametext}>Sachin</Text>
        </View>
        <View>
          <Badge style={styles.badge}>S</Badge>
        </View>
      </View>
    </View>
  );
};

export default UserContainer;

const styles = StyleSheet.create({
  cardText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.secondary,
  },
  userNametext: {
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fontSize.medium,
    color: theme.colors.ui.black,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: theme.colors.brand.blue,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.medium,
    lineHeight: 40,
  },
  userContainer: {
    width: 325,
    height: 65,
    backgroundColor: theme.colors.ui.screenbg,
    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.10)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
