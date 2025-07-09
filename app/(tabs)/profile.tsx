import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { theme } from "@/infrastructure/themes";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import UserBentogrids from "@/components/profile/bento-grids";
import UserDetails from "@/components/profile/user-details";
import LanguageSetting from "@/components/profile/language-setting";
import ReferalCard from "@/components/profile/referal-card";
import { useAuth } from "@/utils/auth-context";
import ProfileSkeleton from "@/components/skeleton/profile/profile-skeleton";
import ProfileHeader from "@/components/profile/profile-header";
import { getUserDetails } from "@/api/user-details";

const profile = () => {
  const [userInfo, setuserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const { token, driverId, logout: authLogout } = useAuth();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const user = await getUserDetails(driverId, token);
      setuserInfo(user.driver);
      if (!user?.driver) {
        // logout or show fallback UI
        await authLogout();
        router.replace("/(screens)/language-selection-screen");
        return;
      }
    } catch (error) {
      console.error("Refresh failed", error);
    } finally {
      setRefreshing(false);
      setLoading(false); // ✅ Add this line back
    }
  }, [driverId, token]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const handleLogout = async () => {
    try {
      await authLogout();
      router.replace("/(screens)/language-selection-screen");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ProfileHeader userInfo={userInfo} />
      <View style={styles.container}>
        <UserBentogrids />
        <ReferalCard />
        <UserDetails data={userInfo} />
        <LanguageSetting />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutbtn}>
          <Text style={styles.logoutbtnText}>{t("Logout")}</Text>
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
  logoutbtnText: {
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.medium,
    fontSize: hp(2.5),
  },
  logoutbtn: {
    backgroundColor: theme.colors.brand.blue,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp(90),
    paddingVertical: hp(1.2),
  },
});
