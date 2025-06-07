import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import BannerContainer from "@/src/components/Home/banner-container";
import UserContainer from "@/src/components/Home/user-container";
import Title from "@/src/components/General/Title";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { width } from "react-native-responsive-sizes";
import TabsComponent from "@/src/components/Home/tabs";
import { Link } from "expo-router";
import HomeSkeleton from "@/src/components/skeleton/home/home-skeleton";
import "../../../global.css";
import { Button } from "@/components/ui/button";
import Example from "@/src/components/card";

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <Link href="/(tabs)/profile">
          <UserContainer />
        </Link>
        <Example />
        <BannerContainer />
        <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
          <Title>{t("Recent_Transcation")}</Title>
          <TabsComponent />
        </View>
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
