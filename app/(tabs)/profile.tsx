import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "@/infrastructure/themes";
import Button from "@/components/General/button";
import { router } from "expo-router";
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
import { Badge } from "react-native-paper";
import EditButton from "@/components/Profile/edit";
import CustomizedBadge from "@/components/Home/CustomizedBadge";
import { width, height, size, fontSize } from "react-native-responsive-sizes";
import { useAuth } from "@/utils/AuthContext";


const profile = () => {
  const [userInfo, setuserInfo] = useState<{ id?: number; name?: string }>({});
  const [userPoints, setuserPoints] = useState([]);
  const { token, driverId } = useAuth();
  const { isAuthenticated, logout } = useAuth();
  useEffect(() => {
    const driver_id = driverId;
    const usertoken =token
   
 
    const getUserDetails = async () => {
      try {
        
        const response = await axiosInstance.post(
          "/user-details.php",
          { driver_id },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const response2 = await axiosInstance.post(
          "/driver-points.php",
          { driver_id, take: 10, skip: 0 },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        )
        const userDetails = response.data;
        const PointsDetails = response2.data;
        setuserInfo(userDetails.driver);
        setuserPoints(response2.data);
        // console.log("User 🏅:", PointsDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  const logot = () => {
    logout()
    router.replace("/(screens)/LanguageSeletionScreen");
  };
   const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Simple DIY Skeleton component
  const Skeleton = ({ width, height, style }:any) => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    return (
      <Animated.View
        style={[
          {
            width,
            height,
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
            opacity,
          },
          style,
        ]}
      />
    );
  };
   const renderSkeleton = () => {
      return (
        <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>
          
          <View style={{ flexDirection: 'column', alignItems: 'center',justifyContent:"center" ,gap:10 }}>
            <Skeleton width={100} height={100} style={{ borderRadius: 100 }} />
            <View style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
              <Skeleton width={120} height={20} />
              <Skeleton width={80} height={20} style={{ margin: 6 }} />
            </View>
          </View>
  
     
          <View style={{  alignItems: "center", gap: 10,display:"flex",flexDirection:"row",justifyContent:"space-evenly" ,marginTop:10 }}>
            <Skeleton width={width(40)} height={hp(12)} style={{ borderRadius: 8 }} />
            <Skeleton width={width(40)} height={hp(12)} style={{ borderRadius: 8 }} />
          </View>
          <Skeleton width={width(82)} height={hp(12)} style={{ borderRadius: 10,marginTop:10 }} />
         
          {/* Recent Transaction Title Skeleton */}
          <View style={{ width: width(82), alignItems: "flex-start", gap: 10 ,}} >
            <Skeleton width={width(40)} height={24} style={{ marginTop:10 }} />
            <Skeleton width={width(80)} height={hp(15)} style={{ borderRadius: 8 }} />
          
           
          </View>
        </View>
      );
    };
  
  return (
    <ScrollView>
      
      {isLoading ? renderSkeleton() : (
        <View><View>
      
        <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>
          
          <View >
            <View style={styles.badge}>
              <Text
                style={{
                  color: theme.colors.text.primary,
                  fontFamily: theme.fontFamily.semiBold,
                  fontSize: fontSize(32),
                  
                }}
              >
                {" "}
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
        <UserBentogrids points={userPoints} />
        <ReferalCard />
        <UserDetails data={userInfo} />
  
        <LanguageSetting />
        <TouchableOpacity onPress={logot} style={styles.btn}>
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
      </View></View>
      )}
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

    // backgroundColor: theme.colors.ui.screenbg,
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
    // paddingHorizontal: hp("2%"),
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
