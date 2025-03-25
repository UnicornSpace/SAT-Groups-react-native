import { StyleSheet, Text, View } from "react-native";
import React from "react";
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
const location = () => {
  return (
    <View style={styles.container}>
      <View>
        <Title>Our Branches</Title>
        <Text style={styles.description}>Find the branches near you</Text>
      </View>
      <TextInput
        mode="outlined"
        placeholder="Search the near branches "
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
      />
      <NearBranchList />
      <AllBranches />
      {/* <GoogleMapLocation/> */}
    </View>
  );
};

export default location;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    alignItems:"center",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
  description: {
    fontSize: hp(2),
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.fontFamily.medium,
  },
  input: {
    width: wp("89%"),
    height: hp(6.5),
    backgroundColor: theme.colors.ui.screenbg,
    fontFamily: theme.fontFamily.medium,
    borderRadius: 10,
    color: theme.colors.ui.black,
    boxShadow: "2px 2px 10px rgba(72, 72, 72, 0.2)",
  },
});
