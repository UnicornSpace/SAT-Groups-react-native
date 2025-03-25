import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/infrastructure/themes";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const UserOTPScreen = () => {
  // const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState("");
  const SubmitNumber =() =>{
    number.length > 0 ? router.replace("/(screens)/otpConfirmationScreen") : null
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 40,
        justifyContent: "center",
        alignItems: "center",
        width: wp(100),
        height: hp(100),
        paddingHorizontal: hp(5),
      }}
    >
      <Text
        style={{
          color: theme.colors.brand.blue,
          fontFamily: theme.fontFamily.semiBold,
          fontSize: hp(3.3),
        }}
      >
        Enter Your Number
      </Text>
      <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderWidth: 0.1,
            boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
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
          autoFocus={true}
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="+ 91 XXXXX  XXXXX"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.ui.black + 70}
          />
        </View>

        <View style={{ display: "flex", flexDirection: "column", gap: 10,justifyContent: "center", alignItems: "center"}}>
          <Text
            style={{
              fontFamily: theme.fontFamily.light,
              fontSize: hp(1.9),
            }}
          >
            We will send an SMS code to verify your number
          </Text>

          <Text
            style={{
              color: theme.colors.brand.blue,
              fontFamily: theme.fontFamily.semiBold,
              fontSize: hp(2.5),
            }}
          >
            OR
          </Text>

          <TouchableOpacity
            style={{
              borderWidth: 1.5,
              borderRadius: 10,
              height: 51,
              width: wp(90),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderColor: theme.colors.brand.blue,
            }}
          >
            <TextInput
            placeholder="Refferal code (optional)"
              style={{
                fontFamily: theme.fontFamily.medium,
                fontSize: hp(2),
                color: theme.colors.text.secondary,
              }}
            >
              
            </TextInput>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={SubmitNumber}>
        <LinearGradient
          colors={["#26456C", "#4073B4", "#4073B4"]}
          style={styles.gradient2}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default UserOTPScreen;

const styles = StyleSheet.create({
  input: {
    height: hp(7),
    width: wp(50),
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
});
