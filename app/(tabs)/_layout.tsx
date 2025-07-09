import {
  Image,
  StyleSheet,
  View,
  Text,
  BackHandler,
  Alert,
} from "react-native";
import { Link, Tabs, useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import "@/app/language-selection";
import { theme } from "@/infrastructure/themes";

import EditButton from "@/components/profile/edit";
import { useAuth } from "@/utils/auth-context";
import ProtectedRoute from "@/components/general/proteted-route";
import { useInternetStatus } from "@/infrastructure/themes/hooks/internet-hook";
import NoInternetScreen from "@/components/network/no-intenet";
import SearchInput from "@/components/branches/search-bar";

const TextComponent = Text as any;
if (TextComponent.defaultProps == null) {
  TextComponent.defaultProps = {};
}

TextComponent.defaultProps.allowFontScaling = false;

function LogoTitle() {
  return (
    <Link href={"/(tabs)"}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#F8F9FA",
          paddingHorizontal: 20,
        }}
      >
        <Image
          style={{ width: 80, height: 50 }}
          source={require("../../assets/images/satgroups/splash-screen.png")}
          resizeMode="contain"
        />
        {/* <LanguageSelection/> */}
      </View>
    </Link>
  );
}

const TabLayout = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const { isConnected, checkInternet } = useInternetStatus();
  // Prevent back button from navigating to auth screens
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Return true to prevent default behavior (going back)
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  // If no internet, show no internet screen
  if (!isConnected) {
    return <NoInternetScreen onRetry={checkInternet} />;
  }
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "#F8F9FA" },
          tabBarActiveTintColor: theme.colors.brand.blue,
          tabBarStyle: { paddingTop: 5, height: 60, paddingHorizontal: 16 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
            header: () => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <LogoTitle />
                  {/* <SearchInput /> */}
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="branches"
          options={{
            title: "Branches",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="map-marker" color={color} />
            ),
            header: () => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <LogoTitle />
                  <SearchInput />
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="milestone"
          options={{
            title: "Milestone",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="gift" color={color} />
            ),
            header: () => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <LogoTitle />
                  {/* <SearchInput /> */}
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            header: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <LogoTitle />
                <EditButton />
              </View>
            ),
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome
                size={24}
                name="user"
                color={color}
                accessibilityLabel="Home "
              />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    backgroundColor: theme.colors.brand.blue,
  },
});
