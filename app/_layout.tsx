import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components";
import { theme } from "@/infrastructure/themes";
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
const _layout = () => {
  let [poppinsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  })
  if(!poppinsLoaded){
    return null
  }
  return (
    <ThemeProvider theme={theme}>
      <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      </PaperProvider>
      <StatusBar   backgroundColor="#000000"  />
    </ThemeProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
