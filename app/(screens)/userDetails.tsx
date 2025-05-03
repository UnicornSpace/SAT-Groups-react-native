import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { theme } from "@/infrastructure/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import ReferalCard from "@/components/Profile/referalCard";
const UserDetails = () => {
  const { isNewUser} = useLocalSearchParams<{ isNewUser:any }>();
  const [userName, setuserName] = React.useState("");
  const [userAge, setuserAge] = React.useState("");
  const [SateName, setSateName] = React.useState("");
  const [Address, setAddress] = React.useState("");
  const [formattedNumber, setFormattedNumber] = React.useState("");
  const onSubmitDetails =async () => {

    
    if(isNewUser){
      userAge.length > 0 && userName.length > 0
      ? router.push("/(tabs)")
      : alert("Please fill all the details");
    }

    try {
      const response = await axiosInstance.post("/user-login-request-otp.php", {
        mobile: formattedNumber,
        // referral_code: referral || undefined,
      });
    } catch (error) {
      
    }
    
  };
  const { t } = useTranslation();
  
 
  return (
    <View
      style={{
        width: wp("100%"),
        height: "100%",
        display: "flex",
        gap: 40,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.semiBold,
          color: theme.colors.brand.blue,
          fontSize: hp("3.5%"),
        }}
      >
        {t("Personal Details")}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: wp("90%"),
        }}
      >
        <TextInput
          autoFocus={true}
          style={styles.input}
          onChangeText={setuserName}
          value={userName}
          placeholder={t("Enter your Full Name")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + 70}
        />
         <TextInput
          style={styles.input}
          onChangeText={setuserAge}
          value={userAge}
          placeholder={t("Enter your Age")}
          keyboardType="number-pad"
          placeholderTextColor={theme.colors.ui.black + 70}
        />
        <TextInput
          style={styles.input}
          onChangeText={setAddress}
          value={Address}
          placeholder={t("Enter State name")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + 70}
        />
        <TextInput
          
          style={styles.input}
          onChangeText={setSateName}
          value={SateName}
          placeholder={t("Addrees")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + 70}
        />
       
      </View>
      

      <TouchableOpacity onPress={onSubmitDetails} style={{}}>
        <LinearGradient
          colors={["#26456C", "#4073B4", "#4073B4"]}
          style={styles.gradient2}
        >
          <Text style={styles.buttonText}>{t("Next")}</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={theme.colors.text.primary}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  input: {
    height: hp("7%"),
    width: wp("90%"),
    borderWidth: 0.2,
    boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    borderRadius: 5,
    borderColor: theme.colors.brand.blue,
    paddingHorizontal: hp("2%"),
  },
  gradient2: {
    width: wp("90%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    fontSize: hp("2.5%"),
    fontFamily: theme.fontFamily.semiBold,
    textAlign: "center",
    color: theme.colors.text.primary,
  },
});
