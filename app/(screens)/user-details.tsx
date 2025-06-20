import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { theme } from "@/infrastructure/themes";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axions-instance";
import ReferalCard from "@/components/profile/referal-card";
import SimpleDatePicker from "@/components/general/dob-input";
import RNPickerSelect from "react-native-picker-select";
import { Dropdown } from "react-native-element-dropdown";
import { indianStates } from "@/utils/data";

// Skeleton Component
const SkeletonLoader = ({ width, height, style }:any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: "#E0E0E0",
          borderRadius: 8,
          opacity: opacity,
        },
        style,
      ]}
    />
  );
};

// UserDetails Skeleton
const UserDetailsSkeleton = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Skeleton */}
      <SkeletonLoader width={200} height={40} style={{ marginBottom: 20 }} />
      
      <View style={styles.formContainer}>
        {/* Input Fields Skeleton */}
        <SkeletonLoader width={wp("90%")} height={hp("7%")} style={{ borderRadius: 5 }} />
        <SkeletonLoader width={wp("90%")} height={hp("7%")} style={{ borderRadius: 5 }} />
        <SkeletonLoader width={wp("90%")} height={hp("7%")} style={{ borderRadius: 5 }} />
        <SkeletonLoader width={wp("90%")} height={hp("7%")} style={{ borderRadius: 5 }} />
        <SkeletonLoader width={wp("90%")} height={hp("7%")} style={{ borderRadius: 5 }} />
      </View>

      {/* Button Skeleton */}
      <SkeletonLoader width={wp("90%")} height={hp("7%")} style={{ borderRadius: 10 }} />
    </ScrollView>
  );
};

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
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Form validation states
  const [errors, setErrors] = useState({
    userName: "",
    dob: "",
    email: "",
    stateName: "",
    address: "",
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Validation functions
  const validateName = (name:any) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.length < 3) {
      return "Name must be at least 3 characters";
    }
    return "";
  };

  const validateEmail = (email:any) => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!email.includes("@gmail.com")) {
      return "Email must contain @gmail.com";
    }
    return "";
  };

  const validateDob = (dob:any) => {
    if (!dob) {
      return "Date of birth is required";
    }
    return "";
  };

  const validateState = (state:any) => {
    if (!state || state === "empty") {
      return "Please select a state";
    }
    return "";
  };

  const validateAddress = (address:any) => {
    if (!address.trim()) {
      return "Address is required";
    }
    if (address.length < 5) {
      return "Please enter a valid address";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      userName: validateName(userName),
      dob: validateDob(dob),
      email: validateEmail(email),
      stateName: validateState(stateName),
      address: validateAddress(address),
    };

    setErrors(newErrors);

    // Form is valid if no error messages exist
    return !Object.values(newErrors).some(error => error !== "");
  };

  const onSubmitDetails = async () => {
    try {
      // Validate the form
      const isValid = validateForm();
      
      if (!isValid) {
        return; // Don't proceed if validation fails
      }

      setLoading(true); // Show loading while submitting

      const response = await axiosInstance.put(
        "/user-update-details.php",
        {
          driver_id: driverId,
          name: userName,
          dob: dob,
          email: email,
          state: stateName,
          city: address,
          profile_pic: "new_base64encodedstring", 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // console.log("Response:", response.data);
      router.replace("/(tabs)");
    } catch (error) {
      setLoading(false);
      console.error("Error submitting details:", error);
    }
  };

  // Handle date change from SimpleDatePicker
  const handleDateChange = (dateString: any) => {
    setDob(dateString);
    setErrors({...errors, dob: validateDob(dateString)});
  };

  if (loading) {
    return <UserDetailsSkeleton />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>{t("Personal Details")}</Text>
        <View style={styles.formContainer}>
          <View>
            <TextInput
              autoFocus={true}
              style={[styles.input, errors.userName ? styles.inputError : null]}
              onChangeText={(text) => {
                setUserName(text);
                setErrors({...errors, userName: validateName(text)});
              }}
              value={userName}
              placeholder={t("Enter your Full Name")}
              keyboardType="name-phone-pad"
              placeholderTextColor={theme.colors.ui.black + "70"}
            />
            {errors.userName ? <Text style={styles.errorText}>{errors.userName}</Text> : null}
          </View>

          <View>
            {/* Using the SimpleDatePicker */}
            <SimpleDatePicker
              onDateChange={handleDateChange}
              placeholder={t("Date of Birth")}
            />
            {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({...errors, email: validateEmail(text)});
              }}
              value={email}
              placeholder={t("Enter your Email")}
              keyboardType="email-address"
              placeholderTextColor={theme.colors.ui.black + "70"}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View>
            <Dropdown
              style={[styles2.dropdown, errors.stateName ? styles2.dropdownError : null]}
              placeholderStyle={styles2.placeholderStyle}
              selectedTextStyle={styles2.selectedTextStyle}
              inputSearchStyle={styles2.inputSearchStyle}
              iconStyle={styles2.iconStyle}
              data={indianStates}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select state"
              searchPlaceholder="Search..."
              value={stateName}
              onChange={(item) => {
                // console.log(item.label);  
                setStateName(item.value);
                setErrors({...errors, stateName: validateState(item.value)});
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles2.icon}
                  color={theme.colors.text.secondary}
                  name="earth"
                  size={18}
                />
              )}
            />
            {errors.stateName ? <Text style={styles.errorText}>{errors.stateName}</Text> : null}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.address ? styles.inputError : null]}
              onChangeText={(text) => {
                setAddress(text);
                setErrors({...errors, address: validateAddress(text)});
              }}
              value={address}
              placeholder={t("Address")}
              keyboardType="name-phone-pad"
              placeholderTextColor={theme.colors.ui.black + "70"}
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>
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
    </KeyboardAvoidingView>
  );
};

export default UserDetails;

const styles2 = StyleSheet.create({
  dropdown: {
    height: hp("7%"),
    width: wp("90%"),
    borderColor: theme.colors.brand.blue + 50,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: hp("2.3%"),
  },
  dropdownError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.medium,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

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
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: hp(1.6),
    marginTop: 3,
    marginLeft: 5,
    fontFamily: theme.fontFamily.regular,
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