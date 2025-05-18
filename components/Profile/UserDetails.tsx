import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "@/infrastructure/themes";
import { router } from "expo-router";


const PersonDetails = ({ icon, title, subtitle }: any) => {
  
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: wp(4),
      }}
    >
      <TouchableOpacity style={styles.userbtn}>
        {/* <Ionicons name="pencil" size={20} color="black" /> */}
        {/* <FontAwesome name={icon} size={18} color={theme.colors.brand.blue} /> */}
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={theme.colors.brand.blue}
        />
        {/* <FontAwesome5 name="user" size={16} color={theme.colors.brand.blue} /> */}
      </TouchableOpacity>
      <View style={{ display: "flex", flexDirection: "column" }}>
        <Text
          style={{
            fontFamily: theme.fontFamily.regular,
            fontSize: hp(1.5),
            color: "#8E8F8F",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: theme.fontFamily.medium,
            fontSize: hp(2),
            color: theme.colors.brand.blue,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const UserDetails = ({ data }: any) => {
  const { t } = useTranslation();
  
  const calculateAge = (dateString: string): number => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
  
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  


  return (
    <View style={{}}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: wp(85),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: hp(2.5),
            fontFamily: theme.fontFamily.medium,
            marginTop: hp(1),
          }}
        >
          {t("Personal Details")}
        </Text>
        
      </View>
      <View style={styles.container}>
      <PersonDetails icon={"calendar"} title={t("Age")} subtitle={`${(data.dob)} `} />

        <PersonDetails icon={"email"} title={t("email")} subtitle={ `${data.email}` } />
        <PersonDetails
          icon={"map-marker"}
          title={t("State")}
          subtitle={` ${data.state}` }
        />
        <PersonDetails icon={"map-outline"} title={t("Address")} subtitle={` ${data.city} `} />
      </View>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    width: wp(85),
    display: "flex",
    flexDirection: "column",
    gap: hp(2),
  },
  
  userbtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    width: wp(12),
    height: hp(5),
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});