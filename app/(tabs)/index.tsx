import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomizedCard from "@/components/General/card-container";
import BannerContainer from "@/components/Home/banner-container";
import { theme } from "@/infrastructure/themes";
import { Badge } from "react-native-paper";
import UserContainer from "@/components/Home/user-container";
import Title from "@/components/General/Title";
import TranscationBtnCollection from "@/components/Home/transcation-btn";
import TranscationCard from "@/components/Home/transcation-card";


const Home = () => {
  return (
    <View style={styles.container}>
      <UserContainer/>
      <BannerContainer />
      <Title>Recent Transcation</Title>
      <TranscationBtnCollection/>
      <TranscationCard/>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    // backgroundColor: "red",
    overflow: "hidden",
    alignItems: "flex-start",
    gap: 20,
    
  },
 
});
