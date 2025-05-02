import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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

const location = () => {
  const { t } = useTranslation();
  const [getBranches, setgetBranches] = useState([]);
  useEffect(() => {
    const driver_id = 2;
    const token =
      "8ef3cf4ed84148e6a5c9faa3267a0acf57f7320703fd7644785a16342a41e7e2";

    const getBranchesList = async () => {
      try {
        const response = await axiosInstance.get(
          "/get-location.php",

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const Branches = response.data;
        setgetBranches(Branches.data);

        console.log("User Details:", Branches.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getBranchesList();
  }, []);

  return (
    <ScrollView>
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
          <Text   style={styles.description}>
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
