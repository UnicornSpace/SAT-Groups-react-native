import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView, View ,StyleSheet} from "react-native";
import { size, fontSize } from "react-native-responsive-sizes";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
 
});

export default ProfileSkeleton;