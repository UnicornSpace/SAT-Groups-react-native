import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { theme } from "@/infrastructure/themes";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "@/utils/axionsInstance";
import { useRouter } from "expo-router";
import { useAuth } from "@/utils/AuthContext";

const EditUser = () => {
  const { token, driverId } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [address, setAddress] = useState("");
  const [email, setemail] = useState("");
  const [stateName, setStateName] = useState("");

  const calculateAgeFromDob = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const getUserDetails = await axiosInstance.post(
          "/user-details.php",
          { driver_id: driverId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = getUserDetails.data.driver;
        console.log("User Details:", user);

        if (user) {
          setUserName(user.name || "");
          setUserAge(user.dob || "");
          // setUserAge(calculateAgeFromDob(user.dob) || "");
          setAddress(user.city || "");
          setemail(user.email || "");
          setStateName(user.state || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUserDetails();
  }, []);

  const handleUpdate = async () => {
    try {
      const updateUserDetails = await axiosInstance.put(
        "/user-update-details.php",
        {
          driver_id: driverId,
          name: userName,
          email: email,
          state: stateName,
          dob: "2004-08-12",
          city: address,
          profile_pic: "new_base64encodedstring",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(updateUserDetails.data);
      if (updateUserDetails.data.success === "success") {
        alert("Profile updated successfully!");
        router.back();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong!");
    }
  };

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
        backgroundColor: theme.colors.text.primary,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.semiBold,
          color: theme.colors.brand.blue,
          fontSize: hp("3.5%"),
        }}
      >
        {t("Edit Profile")}
      </Text>

      <View style={styles.inputGroup}>
        <TextInput
          autoFocus
          style={styles.input}
          onChangeText={setUserName}
          value={userName}
          placeholder={t("Enter your Full Name")}
          keyboardType="name-phone-pad"
          placeholderTextColor={theme.colors.ui.black + "70"}
        />

        <TextInput
          style={styles.input}
          onChangeText={setUserAge}
          value={userAge}
          placeholder={t("Enter your Age")}
          keyboardType="number-pad"
          placeholderTextColor={theme.colors.ui.black + "70"}
        />

        <TextInput
          style={styles.input}
          onChangeText={setAddress}
          value={address}
          placeholder={t("Enter your Address")}
          keyboardType="default"
          placeholderTextColor={theme.colors.ui.black + "70"}
        />
        <TextInput
          style={styles.input}
          onChangeText={setemail}
          value={email}
          placeholder={t("Enter your Email")}
          keyboardType="email-address"
          placeholderTextColor={theme.colors.ui.black + 70}
        />
        <TextInput
          style={styles.input}
          onChangeText={setStateName}
          value={stateName}
          placeholder={t("State")}
          keyboardType="default"
          placeholderTextColor={theme.colors.ui.black + "70"}
        />
      </View>

      <TouchableOpacity onPress={handleUpdate}>
        <LinearGradient
          colors={["#26456C", "#4073B4", "#4073B4"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{t("Update the Profile")}</Text>
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

export default EditUser;

const styles = StyleSheet.create({
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: wp("90%"),
  },
  input: {
    height: hp("7%"),
    width: wp("90%"),
    borderWidth: 0.5,
    paddingHorizontal: 15,
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    borderRadius: 8,
    borderColor: theme.colors.brand.blue,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: hp(2),
    fontFamily: theme.fontFamily.medium,
  },
});
