import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/infrastructure/themes";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native-paper";
import axiosInstance from "@/utils/axionsInstance";
const UserOTPScreen = () => {
  const [number, onChangeNumber] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const SubmitNumber = async () => {
    if (number.length !== 11) {
      Alert.alert("Invalid Number", "Please enter a valid number", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }

    try {
      setLoading(true);
      const formattedNumber = number.replace("-", "");

      const response = await axiosInstance.post("/user-login-request-otp.php", {
        mobile: formattedNumber,
        // referral_code: referral || undefined,
      });

      // console.log("Response:", response.data);
      // console.log("Response:", number);

      if (response.status === 200) {
        router.replace({
          pathname: "/(screens)/otpConfirmationScreen",
          params: {
            number: formattedNumber,
            UserExist: response.data.is_new_user,
          },
        });
      }
    } catch (error) {
      Alert.alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formateNumber = (text: string) => {
    let cleanText = text.replace(/[^0-9]/g, "");
  
    // Allow clearing the field
    if (cleanText === "") {
      onChangeNumber("");
      return;
    }
  
    // Allow only if the first digit is 6-9
    if (!/^([6789])/.test(cleanText)) return;
  
    if (cleanText.length > 10) cleanText = cleanText.slice(0, 10);
    if (cleanText.length > 5)
      cleanText = cleanText.slice(0, 5) + "-" + cleanText.slice(5);
      
    onChangeNumber(cleanText);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: wp(100),
          paddingHorizontal: hp(5),
          gap: 40,
        }}
      >
        <Text
          style={{
            color: theme.colors.brand.blue,
            fontFamily: theme.fontFamily.semiBold,
            fontSize: hp(3.3),
          }}
        >
          {t("Enter Your Number")}
        </Text>

        <View style={{ gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 0.1,
              borderRadius: 10,
              paddingHorizontal: hp(2),
            }}
          >
            <MaterialIcons
              name="phone"
              size={20}
              color={theme.colors.brand.blue}
            />
            <TextInput
              autoFocus
              style={styles.input}
              onChangeText={formateNumber}
              value={number}
              placeholder={t("+91 XXXXX XXXXX")}
              keyboardType="numeric"
              maxLength={11}
              placeholderTextColor={theme.colors.ui.black + 70}
            />
          </View>

          <View style={styles.middleSection}>
            <Text
              style={{
                fontFamily: theme.fontFamily.light,
                fontSize: hp(1.8),
                lineHeight: hp(2),
              }}
            >
              {t("We will send an SMS code to verify your number")}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.brand.blue} />
        ) : (
          <TouchableOpacity onPress={SubmitNumber}>
            <LinearGradient
              colors={["#26456C", "#4073B4", "#4073B4"]}
              style={styles.gradient2}
            >
              <Text style={styles.buttonText}>{t("Continue")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserOTPScreen;

const styles = StyleSheet.create({
  input: {
    height: hp(7),
    width: wp(70),
    fontSize: hp(2),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.ui.black,
  },
  gradient2: {
    width: wp(90),
    height: hp(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: hp(2.5),
    fontFamily: theme.fontFamily.semiBold,
    textAlign: "center",
    color: theme.colors.text.primary,
  },
  referralBox: {
    borderWidth: 1.5,
    borderRadius: 10,
    height: 51,
    width: wp(90),
    justifyContent: "center",
    paddingHorizontal: hp(2),
    borderColor: theme.colors.brand.blue,
  },
  middleSection: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
