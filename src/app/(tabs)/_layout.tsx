import {
  Image,
  StyleSheet,
  View,
  Text,
  BackHandler,
  SafeAreaView,
} from "react-native";
import { Link, Tabs, useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import "../language-selectiom";
import { theme } from "@/infrastructure/themes";
import "@/global.css";
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
      <View className="pl-5 pt-6 w-full   bg-background">
        <Image
          className="w-20 h-20"
          source={require("@/assets/images/satgroups/Logo.png")}
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

  // Prevent back button from navigating to auth screens
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Return true to prevent default behavior (going back)
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-background ">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: theme.colors.brand.blue,
            // headerShown: false,
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
              title: 'Location"',
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
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="user" color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
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
