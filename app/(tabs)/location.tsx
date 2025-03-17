import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Title from "@/components/General/Title";
import { theme } from "@/infrastructure/themes";
import { TextInput } from "react-native-paper";
import { IconBorderRadius } from "@tabler/icons-react-native";
import NearBranchList from "@/components/Location/nearBranchList";
import AllBranches from "@/components/Location/allBranches";
import GoogleMapLocation from "@/components/Location/googleMapLocation";

const location = () => {
  return (
    <View style={styles.container}>
      <View>
        <Title>Our Branches</Title>
        <Text style={styles.description}>Find the branches near you</Text>
      </View>
      <TextInput
        mode="outlined"
        placeholder="Search "
        cursorColor={theme.colors.brand.blue}
        outlineColor={theme.colors.text.secondary + 20}
        activeOutlineColor={theme.colors.brand.blue}
        style={styles.input}
        left={
          <TextInput.Icon
            size={22}
            color={theme.colors.text.secondary}
            icon="magnify"
          />
        }
        placeholderTextColor={theme.colors.text.secondary}
        contentStyle={{
          color: theme.colors.ui.black,
          fontFamily: theme.fontFamily.medium,
          fontSize: theme.fontSize.p,
        }}
      />
      <NearBranchList/>
      <AllBranches/>
      <GoogleMapLocation/>
    </View>
  );
};

export default location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    // backgroundColor: "red",
    overflow: "hidden",
    alignItems: "center",
    gap: 20,
  },
  description: {
    fontSize: theme.fontSize.caption + 2,
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.fontFamily.medium,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: theme.colors.ui.screenbg,
    fontFamily: theme.fontFamily.medium,
    borderRadius: 8,
    color: theme.colors.ui.black,
    boxShadow: "4px 2px 3px rgba(0, 0, 0, 0.25)",
  },
});
