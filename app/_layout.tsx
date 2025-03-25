import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components";
import { theme } from "@/infrastructure/themes";
import i18n from "i18next";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import { PaperProvider } from "react-native-paper";
import { I18nextProvider } from "react-i18next";

const _layout = () => {
  let [poppinsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (!poppinsLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(screens)/LanguageSeletionScreen"
              options={{ title: "Language" }}
            />
            <Stack.Screen name="(tabs)" options={{ title: "tabs" }} />
          </Stack>
          <StatusBar backgroundColor="#000000" />
        </PaperProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
