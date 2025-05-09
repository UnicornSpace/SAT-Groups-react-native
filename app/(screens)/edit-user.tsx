// "use client";

// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
// } from "react-native";
// import { useState, useEffect, useRef } from "react";
// import { theme } from "@/infrastructure/themes";
// import { LinearGradient } from "expo-linear-gradient";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useTranslation } from "react-i18next";
// import axiosInstance from "@/utils/axionsInstance";
// import SimpleDatePicker from "@/components/General/dob-input";
// import { Dropdown } from "react-native-element-dropdown";
// import { indianStates } from "@/utils/data";
// import { useAuth } from "@/utils/AuthContext";

// // Skeleton Component
// const SkeletonLoader = ({ width, height, style }: any) => {
//   const opacity = useRef(new Animated.Value(0.3)).current;

//   useEffect(() => {
//     const animation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(opacity, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(opacity, {
//           toValue: 0.3,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     animation.start();

//     return () => animation.stop();
//   }, [opacity]);

//   return (
//     <Animated.View
//       style={[
//         {
//           width: width,
//           height: height,
//           backgroundColor: "#E0E0E0",
//           borderRadius: 8,
//           opacity: opacity,
//         },
//         style,
//       ]}
//     />
//   );
// };

// // EditProfile Skeleton
// const EditProfileSkeleton = () => {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Header Skeleton */}
//       <SkeletonLoader width={200} height={40} style={{ marginBottom: 20 }} />

//       <View style={styles.formContainer}>
//         {/* Input Fields Skeleton */}
//         <SkeletonLoader
//           width={wp("90%")}
//           height={hp("7%")}
//           style={{ borderRadius: 5 }}
//         />
//         <SkeletonLoader
//           width={wp("90%")}
//           height={hp("7%")}
//           style={{ borderRadius: 5 }}
//         />
//         <SkeletonLoader
//           width={wp("90%")}
//           height={hp("7%")}
//           style={{ borderRadius: 5 }}
//         />
//         <SkeletonLoader
//           width={wp("90%")}
//           height={hp("7%")}
//           style={{ borderRadius: 5 }}
//         />
//         <SkeletonLoader
//           width={wp("90%")}
//           height={hp("7%")}
//           style={{ borderRadius: 5 }}
//         />
//       </View>

//       {/* Button Skeleton */}
//       <SkeletonLoader
//         width={wp("90%")}
//         height={hp("7%")}
//         style={{ borderRadius: 10 }}
//       />
//     </ScrollView>
//   );
// };

// const EditProfile = () => {
//   const { token, driverId } = useAuth();
//   const [userName, setUserName] = useState("");
//   const [dob, setDob] = useState(""); // Store date as a string in format YYYY-MM-DD
//   const [email, setEmail] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(true);
//   const { t } = useTranslation();

//   // Form validation states
//   const [errors, setErrors] = useState({
//     userName: "",
//     dob: "",
//     email: "",
//     stateName: "",
//     address: "",
//   });

//   useEffect(() => {
//     const getUserDetails = async () => {
//       try {
//         setLoading(true);
//         const getUserDetails = await axiosInstance.post(
//           "/user-details.php",
//           { driver_id: driverId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const user = getUserDetails.data.driver;
//         console.log("User Detailsssss:", user);

//         if (user) {
//           setUserName(user.name || "");
//           setDob(user.dob || "");
//           setAddress(user.city || "");
//           setEmail(user.email || "");
//           setStateName(user.state || "");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getUserDetails();
//   }, []);

//   // Validation functions
//   const validateName = (name: any) => {
//     if (!name.trim()) {
//       return "Name is required";
//     }
//     if (name.length < 3) {
//       return "Name must be at least 3 characters";
//     }
//     return "";
//   };

//   const validateEmail = (email: any) => {
//     if (!email.trim()) {
//       return "Email is required";
//     }
//     if (!email.includes("@gmail.com")) {
//       return "Email must contain @gmail.com";
//     }
//     return "";
//   };

//   const validateDob = (dob: any) => {
//     if (!dob) {
//       return "Date of birth is required";
//     }
//     return "";
//   };

//   const validateState = (state: any) => {
//     if (!state || state === "empty") {
//       return "Please select a state";
//     }
//     return "";
//   };

//   const validateAddress = (address: any) => {
//     if (!address.trim()) {
//       return "Address is required";
//     }
//     if (address.length < 5) {
//       return "Please enter a valid address";
//     }
//     return "";
//   };

//   const validateForm = () => {
//     const newErrors = {
//       userName: validateName(userName),
//       dob: validateDob(dob),
//       email: validateEmail(email),
//       stateName: validateState(stateName),
//       address: validateAddress(address),
//     };

//     setErrors(newErrors);

//     // Form is valid if no error messages exist
//     return !Object.values(newErrors).some((error) => error !== "");
//   };

//   const handleUpdate = async () => {
//     try {
//       // Validate the form
//       const isValid = validateForm();

//       if (!isValid) {
//         return; // Don't proceed if validation fails
//       }

//       setLoading(true); // Show loading while submitting

//       const response = await axiosInstance.put(
//         "/user-update-details.php",
//         {
//           driver_id: driverId,
//           name: userName,

//           email: email,

//           city: address,
//           state: stateName,
//           dob: dob, // Send DOB as YYYY-MM-DD
//           profile_pic: "new_base64encodedstring",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Responseeeee:", response.data);

//       if (response.data.success === "success") {
//         alert("Profile updated successfully!");
//         router.back();
//       } else {
//         alert("Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle date change from SimpleDatePicker
//   const handleDateChange = (dateString: any) => {
//     setDob(dateString);
//     setErrors({ ...errors, dob: validateDob(dateString) });
//   };

//   if (loading) {
//     return <EditProfileSkeleton />;
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.headerText}>{t("Edit Profile")}</Text>
//         <View style={styles.formContainer}>
//           <View>
//             <TextInput
//               autoFocus={true}
//               style={[styles.input, errors.userName ? styles.inputError : null]}
//               onChangeText={(text) => {
//                 setUserName(text);
//                 setErrors({ ...errors, userName: validateName(text) });
//               }}
//               value={userName}
//               placeholder={t("Enter your Full Name")}
//               keyboardType="name-phone-pad"
//               placeholderTextColor={theme.colors.ui.black + "70"}
//             />
//             {errors.userName ? (
//               <Text style={styles.errorText}>{errors.userName}</Text>
//             ) : null}
//           </View>

//           <View>
//             {/* Using the SimpleDatePicker */}
//             <SimpleDatePicker
//               onDateChange={handleDateChange}
//               placeholder={t("Date of Birth")}
//               value={dob} // Pass the dob state as value
//             />
//             {errors.dob ? (
//               <Text style={styles.errorText}>{errors.dob}</Text>
//             ) : null}
//           </View>

//           <View>
//             <TextInput
//               style={[styles.input, errors.email ? styles.inputError : null]}
//               onChangeText={(text) => {
//                 setEmail(text);
//                 setErrors({ ...errors, email: validateEmail(text) });
//               }}
//               value={email}
//               placeholder={t("Enter your Email")}
//               keyboardType="email-address"
//               placeholderTextColor={theme.colors.ui.black + "70"}
//             />
//             {errors.email ? (
//               <Text style={styles.errorText}>{errors.email}</Text>
//             ) : null}
//           </View>

//           <View>
//             <Dropdown
//               style={[
//                 styles2.dropdown,
//                 errors.stateName ? styles2.dropdownError : null,
//               ]}
//               placeholderStyle={styles2.placeholderStyle}
//               selectedTextStyle={styles2.selectedTextStyle}
//               inputSearchStyle={styles2.inputSearchStyle}
//               iconStyle={styles2.iconStyle}
//               data={indianStates}
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select state"
//               searchPlaceholder="Search..."
//               value={stateName}
//               onChange={(item) => {
//                 setStateName(item.value);
//                 setErrors({ ...errors, stateName: validateState(item.value) });
//               }}
//               renderLeftIcon={() => (
//                 <AntDesign
//                   style={styles2.icon}
//                   color={theme.colors.text.secondary}
//                   name="earth"
//                   size={18}
//                 />
//               )}
//             />
//             {errors.stateName ? (
//               <Text style={styles.errorText}>{errors.stateName}</Text>
//             ) : null}
//           </View>

//           <View>
//             <TextInput
//               style={[styles.input, errors.address ? styles.inputError : null]}
//               onChangeText={(text) => {
//                 setAddress(text);
//                 setErrors({ ...errors, address: validateAddress(text) });
//               }}
//               value={address}
//               placeholder={t("Address")}
//               keyboardType="name-phone-pad"
//               placeholderTextColor={theme.colors.ui.black + "70"}
//             />
//             {errors.address ? (
//               <Text style={styles.errorText}>{errors.address}</Text>
//             ) : null}
//           </View>
//         </View>

//         <TouchableOpacity onPress={handleUpdate}>
//           <LinearGradient
//             colors={["#26456C", "#4073B4", "#4073B4"]}
//             style={styles.gradient2}
//           >
//             <Text style={styles.buttonText}>{t("Update Profile")}</Text>
//             <Ionicons
//               name="arrow-forward"
//               size={20}
//               color={theme.colors.text.primary}
//             />
//           </LinearGradient>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default EditProfile;

// const styles2 = StyleSheet.create({
//   dropdown: {
//     height: hp("7%"),
//     width: wp("90%"),
//     borderColor: theme.colors.brand.blue + 50,
//     borderWidth: 0.5,
//     borderRadius: 5,
//     paddingHorizontal: hp("2.3%"),
//   },
//   dropdownError: {
//     borderColor: "red",
//     borderWidth: 1,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   placeholderStyle: {
//     fontSize: 14,
//   },
//   selectedTextStyle: {
//     fontSize: 14,
//     color: theme.colors.ui.black,
//     fontFamily: theme.fontFamily.medium,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
// });

// const styles = StyleSheet.create({
//   container: {
//     width: wp("100%"),
//     minHeight: hp("100%"),
//     display: "flex",
//     gap: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 30,
//     paddingVertical: 20,
//   },
//   headerText: {
//     fontFamily: theme.fontFamily.semiBold,
//     color: theme.colors.brand.blue,
//     fontSize: hp("3.5%"),
//   },
//   formContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//     width: wp("90%"),
//   },
//   input: {
//     height: hp("7%"),
//     width: wp("90%"),
//     borderWidth: 0.2,
//     borderColor: theme.colors.brand.blue,
//     color: theme.colors.ui.black,
//     fontFamily: theme.fontFamily.semiBold,
//     borderRadius: 5,
//     paddingHorizontal: hp("2.3%"),
//   },
//   inputError: {
//     borderColor: "red",
//     borderWidth: 1,
//   },
//   errorText: {
//     color: "red",
//     fontSize: hp(1.6),
//     marginTop: 3,
//     marginLeft: 5,
//     fontFamily: theme.fontFamily.regular,
//   },
//   gradient2: {
//     width: wp("90%"),
//     height: hp("7%"),
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 10,
//     display: "flex",
//     flexDirection: "row",
//     gap: 10,
//   },
//   buttonText: {
//     fontSize: hp("2.5%"),
//     fontFamily: theme.fontFamily.semiBold,
//     textAlign: "center",
//     color: theme.colors.text.primary,
//   },
// });


"use client";

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
import { useState, useEffect, useRef } from "react";
import { theme } from "@/infrastructure/themes";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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

// Skeleton Component
const SkeletonLoader = ({ width, height, style }: any) => {
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

// EditProfile Skeleton
const EditProfileSkeleton = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Skeleton */}
      <SkeletonLoader width={200} height={40} style={{ marginBottom: 20 }} />

      <View style={styles.formContainer}>
        {/* Input Fields Skeleton */}
        <SkeletonLoader
          width={wp("90%")}
          height={hp("7%")}
          style={{ borderRadius: 5 }}
        />
        <SkeletonLoader
          width={wp("90%")}
          height={hp("7%")}
          style={{ borderRadius: 5 }}
        />
        <SkeletonLoader
          width={wp("90%")}
          height={hp("7%")}
          style={{ borderRadius: 5 }}
        />
        <SkeletonLoader
          width={wp("90%")}
          height={hp("7%")}
          style={{ borderRadius: 5 }}
        />
        <SkeletonLoader
          width={wp("90%")}
          height={hp("7%")}
          style={{ borderRadius: 5 }}
        />
      </View>

      {/* Button Skeleton */}
      <SkeletonLoader
        width={wp("90%")}
        height={hp("7%")}
        style={{ borderRadius: 10 }}
      />
    </ScrollView>
  );
};

const EditProfile = () => {
  const { token, driverId } = useAuth();
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

  // Debug log to verify DOB
  useEffect(() => {
    console.log("Current DOB state:", dob);
  }, [dob]);

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
        console.log("User Details:", user);

        if (user) {
          setUserName(user.name || "");
          // Make sure DOB is valid before setting it
          if (user.dob && user.dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
            setDob(user.dob);
            console.log("Setting DOB from API:", user.dob);
          }
          setAddress(user.city || "");
          setEmail(user.email || "");
          setStateName(user.state || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  // Validation functions
  const validateName = (name: any) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.length < 3) {
      return "Name must be at least 3 characters";
    }
    return "";
  };

  const validateEmail = (email: any) => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!email.includes("@gmail.com")) {
      return "Email must contain @gmail.com";
    }
    return "";
  };

  const validateDob = (dob: any) => {
    if (!dob) {
      return "Date of birth is required";
    }
    return "";
  };

  const validateState = (state: any) => {
    if (!state || state === "empty") {
      return "Please select a state";
    }
    return "";
  };

  const validateAddress = (address: any) => {
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
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // const handleUpdate = async () => {
  //   try {
  //     // Validate the form
  //     const isValid = validateForm();

  //     if (!isValid) {
  //       return; // Don't proceed if validation fails
  //     }

  //     setLoading(true); // Show loading while submitting

  //     // Log what we're sending to the API
  //     console.log("Sending update request with data:", {
  //       driver_id: driverId,
  //       name: userName,
  //       email: email,
  //       city: address, // Note: sending address to 'city' field
  //       state: stateName,
  //       dob: dob,
  //     });

  //     const response = await axiosInstance.put(
  //       "/user-update-details.php",
  //       {
  //         driver_id: driverId,
  //         name: userName,
  //         email: email,
  //         city: address.trim(), // Trim whitespace from address
  //         state: stateName,
  //         dob: dob, // Make sure DOB is in YYYY-MM-DD format
  //         profile_pic: "new_base64encodedstring",
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("API Response:", response.data);

  //     if (response.data.success === "success") {
  //       alert("Profile updated successfully!");
  //       router.back();
  //     } else {
  //       alert("Failed to update profile.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     alert("Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle date change from SimpleDatePicker
  
const handleUpdate = async () => {
  try {
    // Validate the form
    const isValid = validateForm();

    if (!isValid) {
      return; // Don't proceed if validation fails
    }

    setLoading(true); // Show loading while submitting

    // Clean up all data before sending
    const updateData = {
      driver_id: driverId,
      name: userName.trim(),
      email: email.trim(),
      city: address.trim(), 
      state: stateName,
      dob: dob,
      profile_pic: "new_base64encodedstring",
    };
    
    console.log("Sending update request with data:", updateData);

    const response = await axiosInstance.put(
      "/user-update-details.php",
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);

    // More precise success check
    if (response.data && (response.data.success === "success" || response.data.status === "success")) {
      // alert("Profile updated successfully!");
      
      // Force refresh before navigating back
      try {
        // Optional: Refresh user data in context if you have that functionality
        const refreshResponse = await axiosInstance.post(
          "/user-details.php",
          { driver_id: driverId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User data refreshed before navigation");
      } catch (refreshError) {
        console.error("Error refreshing user data:", refreshError);
        // Continue with navigation even if refresh fails
      }
      
      // Navigate back to profile
      router.back();
    } else {
      // More detailed error message
      const errorMsg = response.data && response.data.message 
        ? response.data.message 
        : "Failed to update profile. Please check your information and try again.";
      alert(errorMsg);
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    // Better error handling with response details
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Something went wrong!";
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};
  
  
  const handleDateChange = (dateString: string) => {
    console.log("Date changed to:", dateString);
    if (dateString) {
      setDob(dateString);
      setErrors({ ...errors, dob: validateDob(dateString) });
    }
  };

  if (loading) {
    return <EditProfileSkeleton />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>{t("Edit Profile")}</Text>
        <View style={styles.formContainer}>
          <View>
            <TextInput
              autoFocus={false} // Changed to false to avoid keyboard popping up automatically
              style={[styles.input, errors.userName ? styles.inputError : null]}
              onChangeText={(text) => {
                setUserName(text);
                setErrors({ ...errors, userName: validateName(text) });
              }}
              value={userName}
              placeholder={t("Enter your Full Name")}
              keyboardType="name-phone-pad"
              placeholderTextColor={theme.colors.ui.black + "70"}
            />
            {errors.userName ? (
              <Text style={styles.errorText}>{errors.userName}</Text>
            ) : null}
          </View>

          <View>
            {/* Using the SimpleDatePicker */}
            <SimpleDatePicker
              onDateChange={handleDateChange}
              placeholder={t("Date of Birth")}
              value={dob} // Pass the dob state as value
            />
            {errors.dob ? (
              <Text style={styles.errorText}>{errors.dob}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: validateEmail(text) });
              }}
              value={email}
              placeholder={t("Enter your Email")}
              keyboardType="email-address"
              placeholderTextColor={theme.colors.ui.black + "70"}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View>
            <Dropdown
              style={[
                styles2.dropdown,
                errors.stateName ? styles2.dropdownError : null,
              ]}
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
                setStateName(item.value);
                setErrors({ ...errors, stateName: validateState(item.value) });
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
            {errors.stateName ? (
              <Text style={styles.errorText}>{errors.stateName}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.address ? styles.inputError : null]}
              onChangeText={(text) => {
                setAddress(text);
                setErrors({ ...errors, address: validateAddress(text) });
              }}
              value={address}
              placeholder={t("Address")}
              keyboardType="name-phone-pad"
              placeholderTextColor={theme.colors.ui.black + "70"}
            />
            {errors.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={handleUpdate}>
          <LinearGradient
            colors={["#26456C", "#4073B4", "#4073B4"]}
            style={styles.gradient2}
          >
            <Text style={styles.buttonText}>{t("Update Profile")}</Text>
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

export default EditProfile;

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
    borderColor: "red",
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
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
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

