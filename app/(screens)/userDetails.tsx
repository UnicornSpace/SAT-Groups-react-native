import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
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
import SimpleDatePicker from "@/components/General/dob-input";

const UserDetails = () => {
  const { isNewUser, driverId, token } = useLocalSearchParams<{
    isNewUser: any;
    driverId: any;
    token: any;
  }>();

  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState(""); // Store date as a string in format YYYY-MM-DD
  const [email, setEmail] = useState("");
  const [stateName, setStateName] = useState("");
  const [address, setAddress] = useState("");
  const { t } = useTranslation();

  const onSubmitDetails = async () => {
    try {
      if (!dob) {
        alert("Please enter your date of birth");
        return;
      }
      
      const response = await axiosInstance.put(
        "/user-update-details.php",
        {
          driver_id: driverId,
          name: userName,
          age: dob, // Send formatted date string directly
          email: email,
          state: stateName,
          city: address,
          profile_pic: "new_base64encodedstring",
          // referral_code: referral || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error submitting details:", error);
    }
  };

  // Handle date change from SimpleDatePicker
  const handleDateChange = (dateString:any) => {
    setDob(dateString);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>
        {t("Personal Details")}
      </Text>
      <View style={styles.formContainer}>
        <TextInput
          autoFocus={true}
          style={styles.input}
          onChangeText={setUserName}
          value={userName}
          placeholder={t("Enter your Full Name")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
        
        {/* Using the SimpleDatePicker */}
        <SimpleDatePicker
          onDateChange={handleDateChange}
          placeholder={t("Date of Birth")}
        />
        
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder={t("Enter your Email")}
          keyboardType="email-address"
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
        <TextInput
          style={styles.input}
          onChangeText={setStateName}
          value={stateName}
          placeholder={t("Enter State name")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
        <TextInput
          style={styles.input}
          onChangeText={setAddress}
          value={address}
          placeholder={t("Address")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + '70'}
        />
      </View>

      <TouchableOpacity onPress={onSubmitDetails}>
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
    </ScrollView>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    minHeight: hp("100%"),
    display: "flex",
    gap: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  headerText: {
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
    fontSize: hp("3.5%"),
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: wp("90%"),
  },
  input: {
    height: hp("7%"),
    width: wp("90%"),
    borderWidth: 0.2,
    borderColor: theme.colors.brand.blue,
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    borderRadius: 5,
    paddingHorizontal: hp("2.3%"),
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