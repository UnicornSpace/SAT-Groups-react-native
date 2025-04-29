import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
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

const Home = () => {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <View style={styles.container}>
        <UserContainer />
        <BannerContainer />
        <View style={{ width: wp("90%"), alignItems: "flex-start", gap: 10 }}>
          <Title>{t("Recent_Transcation")}</Title>
          <TranscationBtnCollection />
        </View>
        <View style={{display: "flex",flexDirection: "column", gap: 8}}>
          <TranscationCard />
          <TranscationCard />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    // height: hp("100%"),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
});
