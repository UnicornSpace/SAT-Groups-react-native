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
import TabsComponent from "@/components/Home/tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { width, height, size, fontSize } from "react-native-responsive-sizes";

const Home = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  
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
      <View style={styles.container}>
        {/* User Container Skeleton */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Skeleton width={60} height={60} style={{ borderRadius: 30 }} />
          <View style={{ marginLeft: 20 }}>
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
          </View>
        </View>

        {/* Banner Container Skeleton */}
        <Skeleton width={width(90)} height={hp(20)} style={{ borderRadius: 10 }} />

        {/* Recent Transaction Title Skeleton */}
        <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
          <Skeleton width={width(60)} height={24} style={{ marginTop: 10, marginBottom: 10 }} />
          
          {/* Tabs Component Skeleton */}
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <Skeleton width={width(20)} height={40} style={{ borderRadius: 20, marginRight: 10 }} />
            <Skeleton width={width(20)} height={40} style={{ borderRadius: 20, marginRight: 10 }} />
            <Skeleton width={width(20)} height={40} style={{ borderRadius: 20 }} />
          </View>
          
          {/* Transaction Cards Skeleton */}
          <View style={{ marginTop: 20, width: '100%' }}>
            {[1, 2, 3].map((_, index) => (
              <Skeleton 
                key={index}
                width={width(90)} 
                height={hp(10)}
                style={{ borderRadius: 8, marginBottom: 10 }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      {isLoading ? renderSkeleton() : (
        <View style={styles.container}>
          <UserContainer />
          <BannerContainer />
          <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
            <Title>{t("Recent_Transcation")}</Title>
            <TabsComponent />
          </View>
        </View>
      )}
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
});