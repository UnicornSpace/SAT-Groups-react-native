import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { theme } from "@/infrastructure/themes";
import { router, useFocusEffect } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import UserBentogrids from "@/components/Profile/bentogrids";
import UserDetails from "@/components/Profile/UserDetails";
import LanguageSetting from "@/components/Profile/languageSetting";
import axiosInstance from "@/utils/axionsInstance";
import ReferalCard from "@/components/Profile/referalCard";
import { size, fontSize } from "react-native-responsive-sizes";
import { useAuth } from "@/utils/AuthContext";

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

// Profile Skeleton Screen
const ProfileSkeleton = () => {
  const { t } = useTranslation();
  
  return (
    <ScrollView>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: hp(2),
          }}
        >
          {/* Avatar Skeleton */}
          <SkeletonLoader 
            width={size(100)} 
            height={size(100)} 
            style={{ borderRadius: 50 }}
          />
          
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: hp(1.5),
            }}
          >
            {/* Name Skeleton */}
            <SkeletonLoader width={150} height={24} style={{ marginBottom: 8 }} />
            
            {/* Driver ID Skeleton */}
            <SkeletonLoader width={120} height={22} style={{ borderRadius: 10 }} />
          </View>
        </View>
      </View>
      
      <View style={styles.container}>
        {/* Bentogrids Skeleton */}
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
          <SkeletonLoader width={wp(28)} height={hp(14)} style={{ borderRadius: 12 }} />
          <SkeletonLoader width={wp(28)} height={hp(14)} style={{ borderRadius: 12 }} />
          <SkeletonLoader width={wp(28)} height={hp(14)} style={{ borderRadius: 12 }} />
        </View>
        
        {/* Referal Card Skeleton */}
        <SkeletonLoader width="100%" height={hp(18)} style={{ borderRadius: 12 }} />
        
        {/* User Details Skeleton */}
        <SkeletonLoader width="100%" height={hp(20)} style={{ borderRadius: 12 }} />
        
        {/* Language Setting Skeleton */}
        <SkeletonLoader width="100%" height={hp(8)} style={{ borderRadius: 8 }} />
        
        {/* Logout Button Skeleton */}
        <SkeletonLoader width="100%" height={hp(6)} style={{ borderRadius: 8 }} />
      </View>
    </ScrollView>
  );
};

const profile = () => {
  const [userInfo, setuserInfo] = useState<{ id?: string; name?: string, points?: number }>({ 
    id: undefined, 
    name: undefined,
    points: 0 
  });
  const [loading, setLoading] = useState(true);
  const { token, driverId, clearAuthData, logout: authLogout } = useAuth();
  const { t } = useTranslation();
  
  // Extract getUserDetails as a separate function so we can call it multiple times
  const getUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/user-details.php",
        { driver_id: driverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userDetails = response.data;
      setuserInfo(userDetails.driver);
      console.log("User Details refreshed:", userDetails.driver);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use this hook to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Profile screen focused - refreshing data");
      getUserDetails();
      return () => {
        // Cleanup if needed
      };
    }, [driverId, token])
  );
  
  // Initial data loading
  useEffect(() => {
    getUserDetails();
  }, []);

  // Fixed logout function that properly calls the logout from AuthContext
  const handleLogout = async () => {
    try {
      console.log("Logging out user");
      // Use the logout function from AuthContext
      await authLogout();
      // Then navigate to language selection screen
      router.replace("/(screens)/LanguageSeletionScreen");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }
  
  return (
    <ScrollView>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <View style={styles.badge}>
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: theme.fontFamily.semiBold,
                  fontSize: fontSize(32),
                }}
              >
                {userInfo.name?.charAt(0)}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: hp(3), fontFamily: theme.fontFamily.semiBold }}
            >
              {userInfo.name}
            </Text>
  
            <LinearGradient
              colors={["#4A86D2", theme.colors.brand.blue]}
              style={styles.gradient}
            >
              <Text style={styles.date}>{t(`Driver ID : ${userInfo.id}`)}</Text>
            </LinearGradient>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <UserBentogrids points={userInfo.points || 0} />
        <ReferalCard />
        <UserDetails data={userInfo} />
  
        <LanguageSetting />
        <TouchableOpacity onPress={handleLogout} style={styles.btn}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontFamily: theme.fontFamily.medium,
              fontSize: hp(2.5),
            }}
          >
            {t("Logout")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: hp(2.5),
    marginVertical: hp(2.5),
    alignItems: "flex-start",
    gap: 18,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "100%",
    width: "90%",
  },
  gradient: {
    paddingVertical: hp(0.45),
    paddingHorizontal: hp(2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  dateContainer: {
    borderRadius: 5,
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: hp(1.5),
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
  },
  btn: {
    backgroundColor: theme.colors.brand.blue,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp(90),
    paddingVertical: hp(1.2),
  },
  input: {
    height: hp("7%"),
    width: wp("90%"),
    borderWidth: 0.2,
    boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
    color: theme.colors.ui.black,
    fontFamily: theme.fontFamily.semiBold,
    borderRadius: 5,
    borderColor: theme.colors.brand.blue,
  },
  badge: {
    width: size(100),
    height: size(100),
    borderRadius: 50,
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});