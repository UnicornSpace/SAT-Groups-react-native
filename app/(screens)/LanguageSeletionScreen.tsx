import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/infrastructure/themes";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
type Language = {
  code: string;
  name: string;
  trans: string;
};

const LanguageSeletionScreen = () => {
  const [error, setError] = useState(null);
  const [value, setValue] = React.useState("");
  const [SelectLang, setSelectLang] = useState<string | null>(null);

  const languages: Language[] = [
    { code: "A", name: "ENGLISH", trans: "en" },
    { code: "அ", name: "தமிழ்", trans: "tam" },
    { code: "अ", name: "हिन्दी", trans: "hi" },
    { code: "ಅ", name: "ಕನ್ನಡ", trans: "kan" },
    { code: "అ", name: "తెలుగు", trans: "tel" },
  ];
  const { t, ready, i18n } = useTranslation();

  React.useEffect(() => {
    try {
      console.log("i18n initialization status:", i18n.isInitialized);
      console.log("Current language:", i18n.language);
      console.log(
        "Available resources:",
        Object.keys(i18n.options.resources || {})
      );
    } catch (err) {
      console.error("Error checking i18n:", err);
      // setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Translation Error: {error}</Text>
      </View>
    );
  }
  const SubmitLang = () => {
    if (SelectLang) {
      i18next.changeLanguage(SelectLang).then(() => {
        router.replace("/(screens)/otp-screen");
      });
      console.log(SelectLang);
    }
  };

  return (
    <View
      style={{
        // flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 35,
        justifyContent: "center",
        alignItems: "center",
        width: wp(100),
        height: hp(100),
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: wp(100),
        }}
      >
        <Text
          style={{
            fontFamily: theme.fontFamily.semiBold,
            fontSize: hp(3.3),
            color: theme.colors.brand.blue,
          }}
        >
          Language
        </Text>
        <Text
          style={{
            fontFamily: theme.fontFamily.medium,
            fontSize: hp(2.1),
            color: theme.colors.text.secondary,
          }}
        >
          Choose your preferred language.
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
        }}
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setSelectLang(lang.trans)}
            style={{
              width: wp(90),
              height: hp(8),
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              borderColor: theme.colors.ui.black + 80,
              borderWidth: 1,
              borderRadius: 10,
              padding: hp(2.2),
            }}
          >
            <LinearGradient
              colors={["#4A86D2", theme.colors.brand.blue]}
              style={styles.gradient}
            >
              <Text style={styles.text}>{lang.code}</Text>
            </LinearGradient>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: wp(70),
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.medium,
                  fontSize: hp(2.2),
                }}
              >
                {lang.name}
              </Text>
              {SelectLang == lang.trans && (
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={theme.colors.brand.blue}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {SelectLang && (
        <TouchableOpacity onPress={SubmitLang}>
          <LinearGradient
            colors={["#26456C", "#4073B4", "#4073B4"]}
            style={styles.gradient2}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  gradient: {
    width: wp(11),
    height: hp(5),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  gradient2: {
    width: wp(90),
    height: hp(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
    fontSize: hp(2.2),
  },
  buttonText: {
    fontSize: theme.fontSize.medium,
    fontFamily: theme.fontFamily.medium,
    textAlign: "center",
    color: theme.colors.text.primary,
  },
  btn: {
    backgroundColor: theme.colors.brand.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp(90),
    height: hp(8),
  },
});

export default LanguageSeletionScreen;
