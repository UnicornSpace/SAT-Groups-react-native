import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "@/infrastructure/themes";
import { router, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import { useAuth } from "@/utils/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const OtpConfirmationScreen = () => {
  const { setAuthData, logout, token, isAuthenticated } = useAuth();

  const { number, UserExist } = useLocalSearchParams<{
    number: string;
    UserExist: any;
  }>();
  const [count, setCount] = useState(60);
  const [loading, setLoading] = useState(false);
  const [otpArray, setOtpArray] = useState(["", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  const { t } = useTranslation();

  // Countdown timer
  useEffect(() => {
    if (count <= 0) return;
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  const handleOtpChange = (text: string, i: number) => {
    if (!/^\d+$/.test(text) && text !== "") return;

    const newOtp = [...otpArray];
    newOtp[i] = text;
    setOtpArray(newOtp);

    if (text && i < inputs.current.length - 1) {
      inputs.current[i + 1]?.focus();
    }
    if (!text && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const otpVerified = async () => {
    const finalOtp = otpArray.join("");

    if (finalOtp.length < 5) {
      Alert.alert("Error", "Please enter a valid 5-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/user-login-verify-otp.php", {
        mobile: number,
        otp: otpArray.join(""),
      });

      // console.log("API Response: ", response.data);
      // console.log("🤣",UserExist );

      const token = response.data.token;
      const driverId = response.data.driver?.id;

      if (token) {
        
        await setAuthData(token, driverId);
        // Check if user is new and route accordingly
        if (UserExist === "true") {
          console.log("Routing to userDetails page for new user");
          router.replace({
            pathname: "/(screens)/userDetails",
            params: { response: token, isNewUser: "true", driverId, token },
          });
        } else {
          console.log("Routing to tabs for existing user");
          router.replace({
            pathname: "/(tabs)",
            params: { response: token },
          });
        }
      } else {
        Alert.alert("Error", "Wrong OTP, please try again.");
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      Alert.alert(
        "Something went wrong",
        error.message || "Failed to verify OTP"
      );
    } finally {
      setLoading(false);
    }
  };
  const resendOtpHandler = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/user-login-request-otp.php", {
        mobile: number,
      });

      if (response.data?.status === "success") {
        Alert.alert("Success", "OTP has been resent");
        setCount(60); // Restart the countdown
      } else {
        Alert.alert("Error", "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      Alert.alert("Error", error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        width: wp("100%"),
        height: hp("100%"),
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: hp(5),
          left: hp(2),
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.brand.blue}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontFamily: theme.fontFamily.semiBold,
          color: theme.colors.brand.blue,
          fontSize: hp(3.2),
        }}
      >
        {t("OTP Code")}
      </Text>

      <View style={{ alignItems: "center", gap: 15, width: wp("90%") }}>
        <View style={styles.otpInputContainer}>
          {otpArray.map((digit, i) => (
            <TextInput
              autoFocus={i === 0}
              key={i}
              ref={(ref) => (inputs.current[i] = ref!)}
              style={styles.input}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, i)}
              maxLength={1}
              keyboardType="numeric"
              placeholder="-"
              placeholderTextColor={theme.colors.text.secondary}
            />
          ))}
        </View>
        <Text
          style={{
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.text.secondary,
            fontSize: hp(1.9),
          }}
        >
          {t("We sent a confirmation code to")} +91 {String(number).slice(0, 3)}
          XX XXXXX
        </Text>
      </View>

      <View style={{ alignItems: "center", gap: 15, width: wp("90%") }}>
        <TouchableOpacity
          onPress={otpVerified}
          style={[
            styles.btn,
            { opacity: otpArray.includes("") || loading ? 0.5 : 1 },
          ]}
          disabled={otpArray.includes("") || loading}
        >
          <Text style={styles.buttonText}>{t("Continue")}</Text>
        </TouchableOpacity>
        {count > 0 ? (
          <Text
            style={{
              fontFamily: theme.fontFamily.regular,
              color: theme.colors.text.secondary,
              fontSize: hp(1.9),
            }}
          >
            {t("Resend code in")}{" "}
            <Text
              style={{
                fontWeight: "bold",
                fontSize: hp(1.9),
                fontFamily: theme.fontFamily.regular,
              }}
            >
              {count} {t("sec")}
            </Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={resendOtpHandler}>
            <Text
              style={{
                fontFamily: theme.fontFamily.semiBold,
                color: theme.colors.brand.blue,
                fontSize: hp(1.9),
                textDecorationLine: "underline",
              }}
            >
              {t("Resend Code")}
            </Text>
          </TouchableOpacity>
        )}
        {/* <Text
          style={{
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.text.secondary,
            fontSize: hp(1.9),
          }}
        >
          {t("Resend code in")}{" "}
          <Text
            style={{
              fontWeight: "bold",
              fontSize: hp(1.9),
              fontFamily: theme.fontFamily.regular,
            }}
          >
            {count} {t("sec")}
          </Text>
        </Text> */}
      </View>
    </View>
  );
};

export default OtpConfirmationScreen;

const styles = StyleSheet.create({
  input: {
    height: hp(10),
    width: wp(15),
    borderWidth: 1,
    color: theme.colors.brand.blue,
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fontSize.h3,
    borderRadius: 5,
    borderColor: theme.colors.brand.blue,
    textAlign: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  buttonText: {
    fontSize: theme.fontSize.medium,
    fontFamily: theme.fontFamily.semiBold,
    textAlign: "center",
    color: theme.colors.text.primary,
  },
  btn: {
    backgroundColor: theme.colors.brand.blue,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: wp("90%"),
    height: hp("7%"),
  },
});
