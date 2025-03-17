import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomizedCard from "../General/card-container";
import { Badge } from "react-native-paper";
import { theme } from "@/infrastructure/themes";

const TranscationCard = () => {
  return (
    <View style={styles.card}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 11,
        }}
      >
        <View>
          <Image
            source={require("@/assets/images/satgroups/noxBlue-Logo.png")}
            style={{ width: 70, height: 80 }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.heading}>Nox Solution</Text>
          <Text style={styles.place}>Perundurai</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>9th march</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.points}>+ 50</Text>
      </View>
    </View>
  );
};

export default TranscationCard;

const styles = StyleSheet.create({
  card: {
    width: 325,
    height: 100,
    backgroundColor: '#F2F3F5',
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderColor: "#C5C5C5",
    borderWidth: 0.3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 17,
  },
  heading: {
    fontSize: theme.fontSize.p,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
  },
  place: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
  },
  dateContainer: {
    borderRadius: 5,
    height: 23,
    width: 65,
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: 10,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  points:{
    fontSize: 20,
    color: theme.colors.brand.green,
    fontFamily: theme.fontFamily.bold,
  }
});
