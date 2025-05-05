import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Title from "@/components/General/Title";
import { theme } from "@/infrastructure/themes";
import { TextInput } from "react-native-paper";
import { IconBorderRadius } from "@tabler/icons-react-native";
import NearBranchList from "@/components/Location/nearBranchList";
import AllBranches from "@/components/Location/allBranches";
import GoogleMapLocation from "@/components/Location/googleMapLocation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/utils/axionsInstance";
import { useAuth } from "@/utils/AuthContext";
import { width } from "react-native-responsive-sizes";


 



const location = () => {
  const { t } = useTranslation();
  const [getBranches, setgetBranches] = useState([]);
  const { token, driverId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const driver_id = driverId;
    const usertoken = token;
    const getBranchesList = async () => {
      try {
        const response = await axiosInstance.get(
          "/get-location.php",

          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        const Branches = response.data;
        setgetBranches(Branches.data);

        // console.log("User Details:", Branches.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getBranchesList();
  }, []);
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Simple DIY Skeleton component
  const Skeleton = ({ width, height, style }: any) => {
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
            backgroundColor: "#E0E0E0",
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
        {/* Title + Description Skeleton */}
        <Skeleton width={width(50)} height={28} style={{ marginBottom: 10 }} />
        <Skeleton width={width(70)} height={18} style={{ marginBottom: 20 }} />
  
        {/* NearBranchList Skeleton (Simulate 2 cards) */}
        {[1].map((_, index) => (
          <Skeleton
            key={`near-${index}`}
            width={width(90)}
            height={hp(12)}
            style={{ borderRadius: 8, marginBottom: 12 }}
          />
        ))}
  
        {/* AllBranches Skeleton (Simulate 3 cards) */}

        {[1].map((_, index) => (
          <Skeleton
          
            key={`branch-${index}`}
            width={width(30)}
            height={hp(10)}

            style={{ borderRadius: 100, marginBottom: 12 , display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
          />
        ))}
        <Skeleton width={width(40)} height={24} style={{ marginBottom: 10 }} />
      </View>
    );
  };
  
  return (
    <ScrollView>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Title
              style={{
                fontFamily: theme.fontFamily.medium,
                fontSize: hp("2.8%"),
              }}
            >
              {t("Our Branches").trim()}
            </Title>
            <Text style={styles.description}>
              {t("Find the branches near you")}
            </Text>
          </View>
          {/* <TextInput
          mode="outlined"
          placeholder={t("Search the near branches")}
          cursorColor={theme.colors.brand.blue}
          outlineColor={theme.colors.text.secondary + 20}
          activeOutlineColor={theme.colors.brand.blue}
          style={styles.input}
          left={
            <TextInput.Icon
              size={20}
              color={theme.colors.text.secondary}
              icon="magnify"
            />
          }
          placeholderTextColor={theme.colors.text.secondary}
          contentStyle={{
            color: theme.colors.ui.black,
            fontFamily: theme.fontFamily.medium,
            fontSize: hp(2),
          }}
        /> */}
          <NearBranchList />

          <AllBranches branch={getBranches} />
          {/* <GoogleMapLocation/> */}
        </View>
      )}
    </ScrollView>
  );
};

export default location;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    // height: hp('100%'),
    alignItems: "flex-start",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
  description: {
    fontSize: hp("1.8%"),
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.fontFamily.regular,
    marginTop: hp(-0.5),
  },
  input: {
    width: wp("89%"),
    height: hp(6.5),
    backgroundColor: theme.colors.ui.screenbg,
    fontFamily: theme.fontFamily.medium,
    borderRadius: 8,
    borderColor: "#C5C5C5",
    color: theme.colors.ui.black,
    // boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
  },
});
