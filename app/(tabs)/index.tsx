import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Dimensions } from "react-native";
import { Modal, Portal, Text, Button, PaperProvider } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { width } from "react-native-responsive-sizes";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";

import BannerContainer from "@/components/Home/banner-container";
import UserContainer from "@/components/Home/user-container";
import Title from "@/components/General/title";
import TabsComponent from "@/components/Home/tabs";
import HomeSkeleton from "@/components/skeleton/home/home-skeleton";
import axiosInstance from "@/utils/axionsInstance";
import { useAuth } from "@/utils/AuthContext";
import { theme } from "@/infrastructure/themes";
import { Ionicons } from "@expo/vector-icons";
import NoInternetScreen from "@/components/network/no-intenet";

type RedeemItem = {
  status: string;
  redeem_points: string;
  branch: string;
  date: string;
  invoice_no: string;
  authorization_status: string;
  id: string;
};


import { useInternetStatus } from "@/infrastructure/themes/hooks/internet-hook";
const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [redeemList, setRedeemList] = useState<RedeemItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const {checkInternet} = useInternetStatus()
  const { token, driverId } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRedeemList = async () => {
      try {
        const response = await axiosInstance.post(
          "/user-redeem-list.php",
          { driver_id: driverId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const redeemData = response.data;
        // Check if redeemData is empty
        if (!redeemData || redeemData.length === 0) {
          console.log("No redeem data available, so not showing modal.");
          setIsFirstLoad(false);
          return;
        }

        const fixed = `[${redeemData.replace(/}\s*{/g, "},{")}]`;
        const parsed = JSON.parse(fixed);
        setRedeemList(parsed);
        console.log("Redeem Data:", parsed);

        // Show modal automatically on first load if data exists
        if (isFirstLoad && parsed.length > 0) {
          setVisible(true);
          setCurrentIndex(0);
          setIsFirstLoad(false);
        }
      } catch (error) {
        console.error("Error fetching redeem list:", error);
        setIsFirstLoad(false);
      }
    };

    if (token && driverId) {
      fetchRedeemList();
    }
  }, [driverId, token, isFirstLoad]);

  const hideModal = () => setVisible(false);

  const showNextModal = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < redeemList.length) {
      setCurrentIndex(nextIndex);
      setVisible(true);
    } else {
      // All modals have been shown
      setVisible(false);
      console.log("All redemption items have been processed");
    }
  };

  const handleAccept = async () => {
    try {
      const currentItem = redeemList[currentIndex];
      console.log("Redemption accepted for item:", currentItem?.id);

      
      await axiosInstance.post("/authorize-user-redeem-list.php", {
        id: currentItem?.id,
        driver_id: driverId,
        authorization_status: 2
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      hideModal();

      // Show next modal after a short delay
      setTimeout(() => {
        showNextModal();
      }, 500);
    } catch (error) {
      console.error("Error accepting redemption:", error);
    }
  };

  const handleDecline = async () => {
    try {
      const currentItem = redeemList[currentIndex];
      console.log("Redemption declined for item:", currentItem?.id);

      
      await axiosInstance.post("/authorize-user-redeem-list.php", {
        id: currentItem?.id,
        driver_id: driverId,
        authorization_status: 3
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      hideModal();

      // Show next modal after a short delay
      setTimeout(() => {
        showNextModal();
      }, 500);
    } catch (error) {
      console.error("Error declining redemption:", error);
    }
  };

  const currentItem =
    redeemList && redeemList.length > 0 ? redeemList[currentIndex] : null;

  return loading ? (
    <HomeSkeleton />
  ) : (
    <>
      {currentItem && (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            dismissable={false} // Prevent dismissing by tapping outside
            contentContainerStyle={styles.modalContainer}
          >
            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {currentIndex + 1} of {redeemList.length}
              </Text>
            </View>

            <View style={styles.contentContainer}>
              <Ionicons
                name="gift"
                size={40}
                color={theme.colors.brand.green}
                style={{ marginTop: 10 }}
              />
              <Text style={styles.pointsText}>
                <Text style={styles.mediumText}>Redeem Points: </Text>
                {currentItem.redeem_points}
              </Text>

              <Text style={styles.branchText}>{currentItem.branch}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleDecline}
                style={[styles.button, styles.declineButton]}
                labelStyle={{ color: "white" }}
              >
                Decline
              </Button>
              <Button
                mode="contained"
                onPress={handleAccept}
                style={[styles.button, styles.acceptButton]}
                labelStyle={{ color: "white" }}
              >
                Accept
              </Button>
            </View>
          </Modal>
        </Portal>
      )}

      <ScrollView>
        <View style={styles.container}>
          <Link href="/(tabs)/profile">
            <UserContainer />
          </Link>

       

          <BannerContainer />
          <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
            <Title>{t("Recent_Transcation")}</Title>
            <TabsComponent />
          </View>
        </View>
      </ScrollView>
    </>
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
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: wp(85),
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  contentContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  pointsText: {
    fontSize: 20,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.ui.black,
    marginTop: 10,
  },
  mediumText: {
    fontFamily: theme.fontFamily.medium,
  },
  branchText: {
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.brand.blue,
    marginTop: 5,
  },
  detailsContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: "#f44336",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  labelText: {
    fontWeight: "bold",
    color: "#333",
  },
});
