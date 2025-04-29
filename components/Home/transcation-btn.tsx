import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { theme } from "@/infrastructure/themes";
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
} from "@tabler/icons-react-native";
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
        borderWidth: 0.2,
        // boxShadow: "2px 4px 5px rgba(0, 0, 0, 0.25)",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: hp(1.8),
        paddingVertical: hp(0.6),
        gap: 2,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.medium,
          fontSize: hp(1.5),
          color: color,
        }}
      >
        {name}
      </Text>
      {name === "Received" ? (
        <IconArrowBarToDown size={14} color={color} />
      ) : name === "Spent" ? (
        <IconArrowBarToUp size={14} color={color} />
      ) : null}
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
          alignItems: "center",
          minWidth: wp(90),
          gap: 6,
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
