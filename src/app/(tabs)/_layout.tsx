import { Image, StyleSheet, View, Text, BackHandler } from "react-native";
import { Link, Tabs, useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import '../language-selectiom'
import { theme } from "@/infrastructure/themes";

import EditButton from "@/src/components/Profile/edit";
import { useAuth } from "@/utils/AuthContext";
import ProtectedRoute from "@/src/components/General/proteted-route";

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
        source={require("@/assets/images/satgroups/Logo.png")}
        resizeMode="contain"
      />
      {/* <LanguageSelection/> */}
    </View></Link>
  );
}

const TabLayout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  // Prevent back button from navigating to auth screens
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default behavior (going back)
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "#F8F9FA" },
          tabBarActiveTintColor: theme.colors.brand.blue,
          tabBarStyle: { paddingTop: 5, height: 60, paddingHorizontal: 16 },
          header: () => <LogoTitle />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="location"
          options={{
            title: "Branches",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="map-marker" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="milestone"
          options={{
            title: "Milestone",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="gift" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            header: () => (
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <LogoTitle />
                <EditButton />
              </View>
            ),
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="user" color={color} />
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