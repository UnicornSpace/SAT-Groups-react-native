import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { theme } from "@/infrastructure/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconArrowBarToDown } from "@tabler/icons-react-native";

const TranscationBtn = ({ name, color }: any) => {
  const [isActive, setIsActive] = React.useState(false);
  return (
    <TouchableOpacity
      onPress={() => setIsActive(!isActive)}
      style={{
       
        backgroundColor: isActive ? color+20 : "transparent",
        borderColor: color,
        borderBottomWidth: 2,
        boxShadow: "2px 4px 5px rgba(0, 0, 0, 0.25)",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.medium,
          fontSize: 15,
          color: color,
        }}
      >
        {name}
      </Text>
      <IconArrowBarToDown size={20} color={color} />
    </TouchableOpacity>
  );
};

const TranscationBtnCollection = () => {
  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 15 }}>
      <TranscationBtn name={"Received"} color={theme.colors.brand.green} />
      <TranscationBtn name={"Spent"} color={theme.colors.brand.red} />
      <TranscationBtn name={"All"} color={theme.colors.brand.blue} />
    </View>
  );
};

export default TranscationBtnCollection;

const styles = StyleSheet.create({
  TranscationBtn: {},
});
