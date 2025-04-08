import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "@/infrastructure/themes";
import { IconArrowBarToDown } from "@tabler/icons-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
const TranscationBtn = ({
  name,
  color,
  activeButton,
  setActiveButton,
}: any) => {
  const isActive = activeButton === name;

  return (
    <TouchableOpacity
      onPress={() => setActiveButton(name)}
      style={{
        backgroundColor: isActive ? color + "20" : "transparent",
        borderColor: color,
        borderBottomWidth: 2,
        boxShadow: "2px 4px 5px rgba(0, 0, 0, 0.25)",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: hp(1.8),
        paddingVertical: hp(1),
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.medium,
          fontSize: hp(1.8),
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
  const { t } = useTranslation();
  // Add the missing state declaration here
  const [activeButton, setActiveButton] = useState(t("Received")); // Default to "Received"

  return (
    <ScrollView horizontal>
      <View
        style={{
          flexDirection: "row",
          flex: 1, 
          justifyContent: "space-around",
          alignItems: "center",
          minWidth: wp(90),
          gap: 15,
        }}
      >
        <TranscationBtn
          name={t("Received")}
          color={theme.colors.brand.green}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
        <TranscationBtn
          name={t("Spent")}
          color={theme.colors.brand.red}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
        <TranscationBtn
          name={t("All")}
          color={theme.colors.brand.blue}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </View>
    </ScrollView>
  );
};

export default TranscationBtnCollection;

const styles = StyleSheet.create({
  TranscationBtn: {},
});
