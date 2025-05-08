import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import BannerContainer from "@/components/Home/banner-container";
import UserContainer from "@/components/Home/user-container";
import Title from "@/components/General/Title";
import TranscationBtnCollection from "@/components/Home/transcation-btn";
import TranscationCard from "@/components/Home/transcation-card";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { width, height, size, fontSize } from "react-native-responsive-sizes";
import TabsComponent from "@/components/Home/tabs";

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

// Skeleton Screen
const HomeSkeleton = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* User Container Skeleton */}
        <View style={styles.userContainerSkeleton}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SkeletonLoader width={50} height={50} style={{ borderRadius: 25 }} />
            <View>
              <SkeletonLoader width={120} height={20} style={{ marginBottom: 5 }} />
              <SkeletonLoader width={80} height={15} />
            </View>
          </View>
          <SkeletonLoader width={80} height={40} />
        </View>

        {/* Banner Skeleton */}
        <SkeletonLoader width={width(90)} height={180} />

        {/* Title Skeleton */}
        <SkeletonLoader width={200} height={24} style={{ marginTop: 10, marginBottom: 10 }} />

        {/* Tabs Skeleton */}
        <View style={{ flexDirection: "row", width: width(90), gap: 10 }}>
          <SkeletonLoader width={width(28)} height={40} />
          <SkeletonLoader width={width(28)} height={40} />
          <SkeletonLoader width={width(28)} height={40} />
        </View>

        {/* Transaction Cards Skeleton */}
        <View style={{ width: width(90), gap: 15, marginTop: 10 }}>
          <SkeletonLoader width="100%" height={70} />
          <SkeletonLoader width="100%" height={70} />
          <SkeletonLoader width="100%" height={70} />
        </View>
      </View>
    </ScrollView>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <HomeSkeleton />
  ) : (
    <ScrollView>
      <View style={styles.container}>
        <UserContainer />
        <BannerContainer />
        <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
          <Title>{t("Recent_Transcation")}</Title>
          <TabsComponent />
        </View>
        {/* You can add your transaction cards here */}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
  userContainerSkeleton: {
    width: width(90),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});