import { StatusBar, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components";
import { theme } from "@/infrastructure/themes";
import i18n from "i18next";
import * as Linking from "expo-linking";
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
import { AuthProvider } from "@/utils/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerGlobalErrorSetter } from "@/utils/global-error";
import ErrorFallback from "@/components/general/ErrorFallback";

const TextComponent = Text as any;
if (TextComponent.defaultProps == null) {
  TextComponent.defaultProps = {};
}
TextComponent.defaultProps.allowFontScaling = false;

// ✅ Only handle URL ref query from links (e.g. ?ref=USER123 or ?referrer=ref_USER123)
const processReferralLink = async (url: string) => {
  try {
    const { queryParams } = Linking.parse(url);
    let referralCode = null;

    if (queryParams?.referrer && typeof queryParams.referrer === "string") {
      if (queryParams.referrer.startsWith("ref_")) {
        referralCode = queryParams.referrer.replace("ref_", "");
      }
    }

    if (queryParams?.ref && typeof queryParams.ref === "string") {
      referralCode = queryParams.ref;
    }

    if (referralCode) {
      await AsyncStorage.setItem("pendingReferralCode", referralCode);
      console.log("🔗 Saved referral code from deep link:", referralCode);
    }
  } catch (err) {
    console.log("❌ Failed to parse referral from URL:", err);
  }
};

const _layout = () => {
  const [hasGlobalError, setHasGlobalError] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  useEffect(() => {
    registerGlobalErrorSetter(setHasGlobalError);
  }, []);

  // ✅ Handle incoming links to capture referral codes
  useEffect(() => {
    const checkInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        await processReferralLink(url);
      }
    };

    const subscription = Linking.addEventListener("url", (event) => {
      processReferralLink(event.url);
    });

    checkInitialUrl();
    return () => subscription.remove();
  }, []);

  if (hasGlobalError) {
    return <ErrorFallback onRetry={() => setHasGlobalError(false)} />;
  }

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <PaperProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(screens)/language-selection-screen.tsx"
                options={{ title: "Language" }}
              />
              <Stack.Screen name="(tabs)" options={{ title: "tabs" }} />
            </Stack>
            <StatusBar backgroundColor="#000000" barStyle="light-content" />
          </PaperProvider>
        </ThemeProvider>
      </I18nextProvider>
    </AuthProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
