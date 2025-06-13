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
  StatusBar,
  Alert,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { theme } from "@/infrastructure/themes";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import SimpleDatePicker from "@/components/General/dob-input";
import { Dropdown } from "react-native-element-dropdown";
import { indianStates } from "@/utils/data";
import { useAuth } from "@/utils/AuthContext";

// Enhanced Skeleton Component with shimmer effect
const SkeletonLoader = ({ width, height, style }: any) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: "#F0F0F0",
          borderRadius: 12,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: "rgba(255,255,255,0.7)",
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

// Enhanced EditProfile Skeleton
const EditProfileSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      
      {/* Header Skeleton */}
      <LinearGradient
        colors={["#1a365d", "#2d5a87", "#4a90c2"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <SkeletonLoader width={30} height={30} style={{ borderRadius: 15 }} />
          <SkeletonLoader width={150} height={28} style={{ borderRadius: 6 }} />
          <View style={{ width: 30 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.skeletonContent}>
        {/* Profile Avatar Skeleton */}
        <View style={styles.avatarSection}>
          <SkeletonLoader width={120} height={120} style={{ borderRadius: 60 }} />
          <SkeletonLoader width={100} height={20} style={{ marginTop: 12, borderRadius: 4 }} />
        </View>

        {/* Form Fields Skeleton */}
        <View style={styles.formContainer}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.inputContainer}>
              <SkeletonLoader width={wp("85%")} height={60} style={{ borderRadius: 12 }} />
            </View>
          ))}
        </View>

        {/* Button Skeleton */}
        <SkeletonLoader
          width={wp("85%")}
          height={55}
          style={{ borderRadius: 25, marginTop: 20 }}
        />
      </ScrollView>
    </View>
  );
};

const EditProfile = () => {
  const { token, driverId } = useAuth();
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [stateName, setStateName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const { t } = useTranslation();

  // Form validation states
  const [errors, setErrors] = useState({
    userName: "",
    dob: "",
    email: "",
    stateName: "",
    address: "",
  });

  // Animation on mount
  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
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
        
        if (user) {
          setUserName(user.name || "");
          if (user.dob && user.dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
            setDob(user.dob);
          }
          setAddress(user.city || "");
          setEmail(user.email || "");
          setStateName(user.state || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  // Validation functions
  const validateName = (name: any) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateEmail = (email: any) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateDob = (dob: any) => {
    if (!dob) return "Date of birth is required";
    return "";
  };

  const validateState = (state: any) => {
    if (!state || state === "empty") return "Please select a state";
    return "";
  };

  const validateAddress = (address: any) => {
    if (!address.trim()) return "Address is required";
    if (address.length < 5) return "Please enter a valid address";
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
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleUpdate = async () => {
    try {
      const isValid = validateForm();
      if (!isValid) return;

      setUpdating(true);

      const updateData = {
        driver_id: driverId,
        name: userName.trim(),
        email: email.trim(),
        city: address.trim(),
        state: stateName,
        dob: dob,
        profile_pic: "new_base64encodedstring",
      };

      const response = await axiosInstance.put(
        "/user-update-details.php",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && (response.data.success === "success" || response.data.status === "success")) {
        Alert.alert(
          "Success! 🎉",
          "Your profile has been updated successfully",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/profile"),
            },
          ]
        );
      } else {
        const errorMsg = response.data?.message || "Failed to update profile";
        Alert.alert("Update Failed", errorMsg);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      Alert.alert("Error", errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      setDob(dateString);
      setErrors({ ...errors, dob: validateDob(dateString) });
    }
  };

  const renderInputField = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    iconFamily: "MaterialIcons" | "Feather" = "MaterialIcons",
    keyboardType: any = "default",
    error?: string
  ) => {
    const IconComponent = iconFamily === "MaterialIcons" ? MaterialIcons : Feather;
    
    return (
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
          <IconComponent
            name={icon as any}
            size={20}
            color={error ? "#e53e3e" : theme.colors.brand.blue}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  };

  if (loading) {
    return <EditProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={["#1a365d", "#2d5a87", "#4a90c2"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("Edit Profile")}</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Profile Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={["#4a90c2", "#2d5a87"]}
                  style={styles.avatarGradient}
                >
                  <MaterialIcons name="person" size={50} color="white" />
                </LinearGradient>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <MaterialIcons name="edit" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarLabel}>Profile Picture</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {renderInputField(
                userName,
                (text) => {
                  setUserName(text);
                  setErrors({ ...errors, userName: validateName(text) });
                },
                t("Enter your Full Name"),
                "person",
                "MaterialIcons",
                "default",
                errors.userName
              )}

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, errors.dob ? styles.inputError : null]}>
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color={errors.dob ? "#e53e3e" : theme.colors.brand.blue}
                    style={styles.inputIcon}
                  />
                  <SimpleDatePicker
                    onDateChange={handleDateChange}
                    placeholder={t("Date of Birth")}
                    value={dob}
                    // Remove style prop as it's not supported by SimpleDatePicker component
                  />
                </View>
                {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}
              </View>

              {renderInputField(
                email,
                (text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: validateEmail(text) });
                },
                t("Enter your Email"),
                "email",
                "MaterialIcons",
                "email-address",
                errors.email
              )}

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, errors.stateName ? styles.inputError : null]}>
                  <MaterialIcons
                    name="location-on"
                    size={20}
                    color={errors.stateName ? "#e53e3e" : theme.colors.brand.blue}
                    style={styles.inputIcon}
                  />
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={indianStates}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select state"
                    searchPlaceholder="Search..."
                    value={stateName}
                    onChange={(item) => {
                      setStateName(item.value);
                      setErrors({ ...errors, stateName: validateState(item.value) });
                    }}
                  />
                </View>
                {errors.stateName ? <Text style={styles.errorText}>{errors.stateName}</Text> : null}
              </View>

              {renderInputField(
                address,
                (text) => {
                  setAddress(text);
                  setErrors({ ...errors, address: validateAddress(text) });
                },
                t("Address"),
                "home",
                "MaterialIcons",
                "default",
                errors.address
              )}
            </View>

            {/* Update Button */}
            <TouchableOpacity
              onPress={handleUpdate}
              disabled={updating}
              style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            >
              <LinearGradient
                colors={updating ? ["#9CA3AF", "#6B7280"] : ["#1a365d", "#2d5a87", "#4a90c2"]}
                style={styles.buttonGradient}
              >
                {updating ? (
                  <View style={styles.buttonContent}>
                    <Animated.View style={styles.loadingSpinner}>
                      <MaterialIcons name="refresh" size={20} color="white" />
                    </Animated.View>
                    <Text style={styles.buttonText}>Updating...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{t("Update Profile")}</Text>
                    <MaterialIcons name="check-circle" size={20} color="white" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  skeletonContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  skeletonContent: {
    padding: 20,
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4a90c2",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarLabel: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: "#e53e3e",
    borderWidth: 2,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  datePickerStyle: {
    flex: 1,
    height: 55,
  },
  dropdown: {
    flex: 1,
    height: 55,
    paddingRight: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 14,
    marginTop: 6,
    marginLeft: 16,
    fontWeight: "500",
  },
  updateButton: {
    width: "100%",
    marginTop: 20,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    borderRadius: 25,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  loadingSpinner: {
    transform: [{ rotate: "45deg" }],
  },
});