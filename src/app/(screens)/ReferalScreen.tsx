import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Svg, { Path } from "react-native-svg";
import { theme } from "@/infrastructure/themes";
import { Button } from "react-native-paper";
import RefferalSteps from "@/src/components/Profile/RefferalSteps";
import { t } from "i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
const ReferalScreen = (props: any) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="white"
        style={{
          position: "absolute",
          top: hp(3),
          left: wp(5),
          zIndex: 1,
        }}
        onPress={() => router.push("/(tabs)/profile")}
      />
      <View
        style={{ position: "absolute", top: hp(8), left: wp(0), zIndex: 0 }}
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={360}
          height={245}
          fill="none"
          {...props}
        >
          <Path
            stroke="#EBEFF5"
            strokeOpacity={0.9}
            strokeWidth={125}
            d="M-57.338 179.995c93.559-27.108 214.444 25.255 291.558-53.608 77.114-78.862 124.897-59.164 223-48.5"
          />
        </Svg>
      </View>
      <Image
        style={{
          width: 120,
          height: 80,
          position: "absolute",
          top: hp(14),
          right: wp(5),
        }}
        source={require("@/assets/images/satgroups//referal.png")}
      />
      <View style={{ paddingTop: wp(17),paddingLeft:hp(2),display:"flex",justifyContent:"center",gap:hp(2), }}>
        <Text
        adjustsFontSizeToFit={true}
        minimumFontScale={0.7}
        numberOfLines={2}
          style={{
            fontFamily: theme.fontFamily.medium,
            color: theme.colors.text.primary,
            // maxWidth: wp(60),
            fontSize: 17,
            // lineHeight: 25,
          }}

        >
          {t("Refer and earn 100 points")}
        </Text>
        <Button
          style={{
            width: wp(40),
          }}
          // icon="camera"
          buttonColor="#5A96D0"
          textColor="#fff"
          mode="elevated"
          onPress={() => console.log("Pressed")}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily.medium,
              fontSize: theme.fontSize.p2,
            }}
          >
            {t("Invite Friends")}
          </Text>
        </Button>
      </View>
      <View style={styles.subContainer}>
        <RefferalSteps/>
        
      </View>
    </View>
  );
};

export default ReferalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: "#36629A",
  },
  subContainer: {
    width: wp(100),
    height: hp(70),
    backgroundColor: "#fff",

    // padding: 20,
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
});
