import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { theme } from "@/infrastructure/themes";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const OtpConfirmationScreen = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (count <= 0) {
        clearInterval(interval);
        return;
      }
      setcount((prevCount) => prevCount - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const [number, onChangeNumber] = React.useState("");
  const [count, setcount] = React.useState(60);
  const OTP = [2, 4, 5, 6];
  const otpVerfifed = () => {
    router.push("/(screens)/userDetails");
  };
  return (
    <View
      style={{
        width: wp("100%"),
        display: "flex",
        gap: 40,
        alignItems: "center",
        justifyContent: "center",
        height: hp("100%"),
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.semiBold,
          color: theme.colors.brand.blue,
          fontSize: hp(3.2),
        }}
      >
        OTP Code
      </Text>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          justifyContent: "center",
          width: wp("90%"),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {OTP.map((e) => {
            return (
              <TextInput
                key={e}
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder={e.toString()}
                placeholderTextColor={theme.colors.text.secondary}
                maxLength={1}
                autoFocus={e === 0}
                keyboardType="numeric"
              />
            );
          })}
        </View>
        <Text
          style={{
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.text.secondary,
            fontSize: hp(1.9),
          }}
        >
          We sent a confirmation code to +91 816XX XXXXX{" "}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          justifyContent: "center",
          width: wp("90%"),
        }}
      >
        <TouchableOpacity onPress={otpVerfifed} style={styles.btn}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.text.secondary,
            fontSize: hp(1.9),
          }}
        >
          Resend code in{" "}
          <Text
            style={{
              fontFamily: theme.fontFamily.regular,
              color: theme.colors.text.secondary,
              fontSize: hp(1.9),
              fontWeight: "bold",
            }}
          >
            {count} sec
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default OtpConfirmationScreen;

const styles = StyleSheet.create({
  input: {
    height: hp(10),
    width: wp(18),
    borderWidth: 1,
    color: theme.colors.brand.blue,
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fontSize.h3,
    borderRadius: 5,
    borderColor: theme.colors.brand.blue,
    textAlign: "center",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp("90%"),
    height: hp("7%"),
  },
});
