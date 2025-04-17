import { ScrollView, StyleSheet, View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const position = {
  step1: {
    top: hp(14),
    left: wp(15),
  },
  step2: {
    top: hp(25),
    left: wp(72),
  },
  step3: {
    top: hp(33),
    left: wp(11),
  },
};

const Product = (props: any) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.svgWrapper}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width={292}
          height={800}
          fill="none"
          {...props}
        >
          <Path
            stroke="url(#a)"
            strokeLinecap="round"
            strokeWidth={15}
            d="M162.443 448.5S-172.204 395 143.708 366s0-66.5 0-66.5-284.903-35 0-64.5c284.902-29.5 0-71 0-71s-247.434-37.5 0-71.5 0-84.5 0-84.5 "
          />

          <Defs>
            <LinearGradient
              id="a"
              x1={143.709}
              x2={143.709}
              y1={8}
              y2={500}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset={0.324} stopColor="#DBDBDB" />
              <Stop offset={0.502} stopColor="#26456C" />
            </LinearGradient>
          </Defs>
        </Svg>
        {
          Object.entries(position).map(([key, pos], index) => (
            <View key={key} style={{ position: "absolute", top: pos.top, left: pos.left }}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={59}
            height={45}
            fill="none"
            {...props}
          >
            <Path
              fill="#fff"
              stroke="#26456C"
              strokeWidth={5}
              d="M29.071 2.5c15.31 0 26.573 9.512 26.573 20s-11.264 20-26.573 20C13.763 42.5 2.5 32.987 2.5 22.5c0-10.488 11.263-20 26.571-20Z"
            />
          </Svg>
        </View>
          ))
        }
      </View>
    </ScrollView>
  );
};

export default Product;

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: hp(5),
    alignItems: "center",
    // backgroundColor: "red",
  },
  svgWrapper: {
    width: wp("100%"),
    alignItems: "center",
  },
});
