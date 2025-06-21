import { ScrollView, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BannerContainer from "@/components/home/banner-container";
import UserDetailsContainer from "@/components/home/user-container";
import RecentTransactionTabs from "@/components/home/recent-transaction-tabs";
import RedeemPointsModel from "@/components/home/redeem-points";
import { Text } from "react-native-paper";

const Home = () => {

  return (
    <ScrollView>
      <RedeemPointsModel />
      <View style={styles.container}>
        <UserDetailsContainer />
        <BannerContainer />
        <RecentTransactionTabs />
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
});
