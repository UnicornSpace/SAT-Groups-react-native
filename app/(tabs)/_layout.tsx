import { Image, StyleSheet, View ,Text} from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { theme } from "@/infrastructure/themes";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
function LogoTitle() {
  return (
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:"#F8F9FA",paddingHorizontal:hp(2.5)}}>
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
      backBehavior="order"
      screenOptions={{
        sceneStyle: { backgroundColor: '#F8F9FA' },
        tabBarActiveTintColor: theme.colors.brand.blue,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 10,
          height: 60,
        },
        header: () => <LogoTitle />,
       
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          
          // header: () => <LogoTitle />,
          tabBarIcon: ({ focused, size, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                size={focused ? 18 : 23}
                color={focused ? "white" : "black"}
              />
              {/* <Image
                style={{ width: 34, height: 34 }}
                source={require("../../assets/images/icons/home.png")}
                resizeMode="contain"
              /> */}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "location-sharp" : "location-outline"}
                size={focused ? 18 : 23}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "gift" : "gift-outline"}
                size={focused ? 18 : 23}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"

        options={{
          
          tabBarIcon: ({ focused, size, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={focused ? "person-sharp" : "person-outline"}
                size={focused ? 18 : 23}
                color={focused ? "white" : "black"}
              />
            </View>
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
    width: 55,
    height: 35,
    backgroundColor: theme.colors.brand.blue,
    borderRadius: 20,
  },
});
