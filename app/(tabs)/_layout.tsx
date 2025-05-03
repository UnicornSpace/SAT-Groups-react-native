import { Image, StyleSheet, View, Text } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import '@/app/language-selectiom'
import { theme } from "@/infrastructure/themes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import EditButton from "@/components/Profile/edit";
const TextComponent = Text as any
if (TextComponent.defaultProps == null) {
  TextComponent.defaultProps = {}
}

TextComponent.defaultProps.allowFontScaling = false

function LogoTitle() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        paddingHorizontal: hp(2.5),
      }}
    >
      <Image
        style={{ width: 80, height: 50 }}
        source={require("../../assets/images/satgroups/Logo.png")}
        resizeMode="contain"
      />
      {/* <LanguageSelection/> */}
    </View>
  );
}
const TabLayout = () => {
  return (
 
   
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
    // width: 55,
    // height: 35,
    backgroundColor: theme.colors.brand.blue,
    // borderRadius: 20,
  },
});
