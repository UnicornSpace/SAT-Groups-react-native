import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
  useBlurOnFulfill,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 5; // Your OTP has 5 digits

const OtpConfirmationScreen = () => {
  const { setAuthData, token } = useAuth();

  const { number, UserExist } = useLocalSearchParams<{
    number: string;
    UserExist: any;
  }>();
  // console.log("Number from params:👍", number);
  const [count, setCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isReferralDetected, setIsReferralDetected] = useState(false);

  // New states for error handling
  const [otpError, setOtpError] = useState("");
  const [isOtpIncorrect, setIsOtpIncorrect] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const { t } = useTranslation();
  const isNewUser = UserExist === "true";

  // react-native-confirmation-code-field hooks
  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  useEffect(() => {
    checkForReferralCode();
  }, []);

  const checkForReferralCode = async () => {
    try {
      const savedReferralCode = await AsyncStorage.getItem(
        "pendingReferralCode"
      );
      if (savedReferralCode) {
        setReferralCode(savedReferralCode);
        setIsReferralDetected(true);
        // Clear it so it doesn't appear again
        await AsyncStorage.removeItem("pendingReferralCode");
      }
    } catch (error) {
      console.log("Error loading referral code:", error);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (count <= 0) return;
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  useEffect(() => {
    // Check if there's a stored referral code
    const loadReferralCode = async () => {
      try {
        const storedReferralCode = await AsyncStorage.getItem("referralCode");
        // console.log("Stored Referral Code:👀👀", storedReferralCode);
        if (storedReferralCode) {
          setReferralCode(storedReferralCode);
          // Optionally remove it after setting
          await AsyncStorage.removeItem("referralCode");
        }
      } catch (error) {
        console.log("Error loading referral code:", error);
      }
    };

    loadReferralCode();
  }, []);

  const handleOtpChange = (text: string) => {
    setOtp(text);

    // Clear error when user starts typing
    if (otpError || isOtpIncorrect) {
      setOtpError("");
      setIsOtpIncorrect(false);
    }

    // Auto-verify when OTP is complete
    if (text.length === CELL_COUNT) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        otpVerified(text);
      }, 100);
    }
  };

  const otpVerified = async (otpValue?: string) => {
    const finalOtp = otpValue || otp;

    if (finalOtp.length < CELL_COUNT) {
      setOtpError(`Please enter a valid ${CELL_COUNT}-digit OTP`);
      return;
    }

    try {
      setLoading(true);
      setOtpError(""); // Clear any previous errors

      const response = await axiosInstance.post("/user-login-verify-otp.php", {
        mobile: number,
        otp: finalOtp,
        referral_code: isNewUser ? referralCode.trim() : undefined, // Include referral code only for new users
      });
      console.log("OTP Verification Response:", response.data);
      if (response.data.status === "invalid_otp") {
        setOtpError("The OTP you entered is invalid");
        console.error("Invalid OTP response:", response.data);
        return;
      }

      const token = response.data.token;
      const driverId = response.data.driver?.id;

      if (token) {
        await setAuthData(token, driverId);
        // Check if user is new and route accordingly
        if (isNewUser) {
          // console.log("Routing to userDetails page for new user");
          router.replace({
            pathname: "/(screens)/userDetails",
            params: {
              response: token,
              isNewUser: "true",
              driverId,
              token,
              referralCode, // Pass referral code to next screen if needed
            },
          });
        } else {
          // console.log("Routing to tabs for existing user");
          router.replace({
            pathname: "/(tabs)",
            params: { response: token },
          });
        }
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      setAttemptCount((prev) => prev + 1);

      // Handle specific OTP errors
      if (error.response?.status === 400 || error.response?.status === 401) {
        setIsOtpIncorrect(true);
        setOtpError("Incorrect OTP. Please check and try again.");
        setOtp(""); // Clear the OTP field for retry
      } else if (error.response?.status === 429) {
        setOtpError("Too many attempts. Please try again later.");
      } else if (error.message?.toLowerCase().includes("otp")) {
        setIsOtpIncorrect(true);
        setOtpError("Invalid OTP. Please enter the correct code.");
        setOtp(""); // Clear the OTP field for retry
      } else {
        setOtpError("Something went wrong. Please try again.");
      }

      // Show alert for multiple failed attempts
      if (attemptCount >= 2) {
        Alert.alert(
          "Multiple Failed Attempts",
          "You've entered an incorrect OTP multiple times. Please check your messages or request a new code.",
          [
            { text: "OK", style: "default" },
            { text: "Resend OTP", onPress: resendOtpHandler, style: "default" },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      setLoading(true);
      setOtpError(""); // Clear errors
      setIsOtpIncorrect(false);
      setAttemptCount(0); // Reset attempt count

      const response = await axiosInstance.post("/user-login-request-otp.php", {
        mobile: number,
      });

      if (response.data?.status === "success") {
        Alert.alert("Success", "OTP has been resent");
        setCount(30); // Restart the countdown
        setOtp(""); // Clear the OTP field
      }
      //  else {
      //   setOtpError("Unexpected response from server. Please try again.");
      // }
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user can proceed (valid OTP and referral code if new user)
  const canProceed = () => {
    const isOtpComplete = otp.length === CELL_COUNT;
    // For new users, require both OTP and referral code
    // For existing users, only require OTP
    return isOtpComplete && (!isNewUser || isNewUser) && !otpError;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            width: wp("100%"),
            height: hp("100%"),
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: hp(5),
              left: hp(2),
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/(screens)/otp-screen")}
            >
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
            {/* New OTP Input using react-native-confirmation-code-field */}
            <CodeField
              InputComponent={TextInput}
              ref={ref as React.RefObject<TextInput>}
              {...props}
              value={otp}
              onChangeText={handleOtpChange}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoFocus={true}
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[
                    styles.otpCell,
                    isFocused && styles.focusedOtpCell,
                    isOtpIncorrect && styles.errorOtpCell, // Add error styling
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text
                    style={[
                      styles.otpCellText,
                      isOtpIncorrect && styles.errorOtpCellText, // Add error text styling
                    ]}
                  >
                    {symbol || (isFocused ? <Cursor /> : "")}
                  </Text>
                </View>
              )}
            />

            {/* Error message display */}
            {otpError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={theme.colors.brand.red || "#FF3B30"}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.errorText}>{otpError}</Text>
              </View>
            ) : null}

            <Text
              style={{
                fontFamily: theme.fontFamily.regular,
                color: theme.colors.text.secondary,
                fontSize: hp(1.9),
                // width: wp("90%"),
                textAlign: "center",
              }}
            >
              {t("We sent a confirmation code to")} {number}
            </Text>
          </View>

          {/* Referral Code Input - Only shown for new users */}
          {isNewUser && (
            <View style={{ alignItems: "center", width: wp("90%") }}>
              <Text
                style={{
                  fontFamily: theme.fontFamily.semiBold,
                  color: theme.colors.brand.blue,
                  fontSize: hp(2),
                  marginBottom: 8,
                  alignSelf: "flex-start",
                }}
              >
                {t("Referral Code")}
              </Text>
              <TextInput
                style={styles.referralInput}
                value={referralCode}
                onChangeText={setReferralCode}
                placeholder={t("Enter referral code (if any)")}
                placeholderTextColor={theme.colors.text.secondary}
                autoCapitalize="characters"
              />
            </View>
          )}

          <View
            style={{
              alignItems: "center",
              gap: 15,
              width: wp("90%"),
              marginTop: isNewUser ? 0 : 20,
            }}
          >
            <TouchableOpacity
              onPress={() => otpVerified()}
              style={[
                styles.btn,
                { opacity: canProceed() && !loading ? 1 : 0.5 },
              ]}
              disabled={!canProceed() || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? t("Verifying...") : t("Continue")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
              <View style={{ width: 8 }} />
              <TouchableOpacity
                onPress={resendOtpHandler}
                disabled={count > 0 || loading}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamily.semiBold,
                    color:
                      count > 0 || loading
                        ? theme.colors.text.secondary
                        : theme.colors.brand.blue,
                    fontSize: hp(1.9),
                    textDecorationLine: "underline",
                    opacity: count > 0 || loading ? 0.5 : 1,
                  }}
                >
                  {t("Resend Code")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OtpConfirmationScreen;

const styles = StyleSheet.create({
  // Old input styles (keeping for referral input)
  referralInput: {
    height: hp(7),
    width: wp(90),
    borderWidth: 1,
    borderColor: theme.colors.brand.blue,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.p,
    color: theme.colors.ui.black,
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

  // New OTP field styles using react-native-confirmation-code-field
  codeFieldRoot: {
    justifyContent: "space-between",
    width: wp(80),
  },
  otpCell: {
    width: wp(12),
    height: hp(8),
    borderWidth: 2,
    borderColor: theme.colors.brand.blue,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  focusedOtpCell: {
    borderColor: theme.colors.brand.blue,
    backgroundColor: theme.colors.brand.blue + "10", // 10% opacity
  },
  otpCellText: {
    fontSize: hp(3),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
    textAlign: "center",
  },

  // Error styles for OTP cells
  errorOtpCell: {
    borderColor: theme.colors.brand.red || "#FF3B30",
    backgroundColor: (theme.colors.brand.red || "#FF3B30") + "10", // 10% opacity
  },
  errorOtpCellText: {
    color: theme.colors.brand.red || "#FF3B30",
  },

  // Error message container
  errorContainer: {
    flexDirection: "row",
    marginLeft: hp(2),
  },
  errorText: {
    fontSize: hp(1.8),
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.brand.red || "#FF3B30",
    flex: 1,
  },
});
