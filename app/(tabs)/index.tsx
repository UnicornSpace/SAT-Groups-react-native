// Home.tsx
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BannerContainer from "@/components/home/banner-container";
import UserDetailsContainer from "@/components/home/user-container";
import RecentTransactionTabs from "@/components/home/recent-transaction-tabs";
import RedeemPointsModel from "@/components/home/redeem-points";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "@/utils/axions-instance";
import { useAuth } from "@/utils/auth-context";
import { Transaction } from "@/types/index.type";

const Home = () => {
  const { token, driverId } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState<{ id?: number; name?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/user-details.php",
        { driver_id: driverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.driver?.name) {
        setUserInfo(response.data.driver);
      } else {
        setUserInfo({});
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      setUserInfo({});
    } finally {
      setIsLoading(false);
    }
  };

  const loadDriverPoints = async () => {
    try {
      const response = await axiosInstance.post(
        "/driver-points.php",
        { driver_id: driverId, take: 20, skip: 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userPoints = response.data;
      setPoints(Number(userPoints.total_points));
      setTransactions(userPoints.transactions || []);
    } catch (error) {
      console.error("Failed to load points:", error);
      setPoints(null);
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (token && driverId) {
      loadUserData();
      loadDriverPoints();
    }
  }, [token, driverId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), loadDriverPoints()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <RedeemPointsModel />
        <View style={styles.container}>
          <UserDetailsContainer userInfo={userInfo} isLoading={isLoading} />
          <BannerContainer points={points} />
          <RecentTransactionTabs transactions={transactions} loading={refreshing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    minHeight: hp(100),
    width: wp("100%"),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
});
