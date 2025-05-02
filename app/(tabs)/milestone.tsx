import { theme } from "@/infrastructure/themes";
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Text,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";

const SvgComponent = () => {
  const scrollRef = useRef<ScrollView>(null);
  /*
  If referred - 50 pts
  */

/*
More than 1 ltrs - free shirt
50 ltrs - 50 pts
100 ltrs - 50 pts
200 ltrs - 100 pts
250 ltrs - 50 pts
500 ltrs - Gift Box 1
550 ltrs - 50 pts
600 ltrs - 50 pts
700 ltrs  - 100 pts
750 ltrs - 50 pts
1000 ltrs -  Gift Box 2

*/

  const points = [
    { x: 160, y: 490, label: "START" },
    { x: 30, y: 448, label: "50 L" },
    { x: 288, y: 385, label: "100 L" },
    { x: 40, y: 315, label: "200 L" },
    { x: 275, y: 250, label: "250 L" },
    { x: 60, y: 175, label: "500 L" },
    { x: 260, y: 105, label: "550 L" },
    { x: 55, y: 15, label: "600 L" },
    { x: 260, y: -51, label: "700 L" },

    { x: 55, y: -135, label: "750 L" },
    { x: 255, y: -190, label: "1000 L" },
  ];

  // Calculate total height for scrollable area
  const totalHeight = Math.max(...points.map((p) => p.y)) + 70;

  // Scroll to bottom on mount
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, []);

  const pathDefinition =
    "M162.443 448.5 S-172.204 395  143.708 366 s0 -66.5 0 -66.5 s-284.903 -35 0 -64.5 c284.902 -29.5 0 -71 0 -71 s-247.434 -37.5 0 -71.5 s0 -84.5 0 -84.5  s -247.434,-37.5 0,-71.5  s 0,-84.5 0,-84.5 s -247.434,-37.5 0,-71.5 s 0,-84.5 0,-84.5 s -247.434,-37.5 0,-71.5";

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
      <View style={{ height: totalHeight + 300 }}>
        <ImageBackground
          opacity={0.3}
          source={require("@/assets/images/satgroups/tile_background.png")}
          resizeMode="cover"
          style={{
            container: {
              flex: 1,
            },
            image: {
              flex: 1,
              justifyContent: "center",
              opacity: "0.5",
            },
            text: {
              color: "white",
              fontSize: 42,
              lineHeight: 84,
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#000000c0",
            },
          }}
        >
          <Svg
            fill={"none"}
            height={totalHeight + 300}
            viewBox={`0 -200 300 ${totalHeight + 200}`} // extend upward for scroll
          >
            <G transform="scale(1) translate(15, 50)">
              <Path
                stroke="url(#a)"
                strokeLinecap="round"
                strokeWidth={20}
                d={pathDefinition}
              />
            </G>

            {points.map((point, index) => (
              <React.Fragment key={index}>
                <Circle
                  cx={point.x}
                  cy={point.y}
                  r={point.label === "START" ? 40 : 22}
                  fill={point.label === "START" ? "#26456C" : "#fff"}
                  stroke={point.label === "START" ? "none" : "#26456C"}
                  strokeWidth={2}
                />
                <Text
                  x={point.x}
                  y={point.y + 5}
                  fill={point.label === "START" ? "#fff" : "#26456C"}
                  fontFamily={
                    point.label === "START"
                      ? theme.fontFamily.bold
                      : theme.fontFamily.regular
                  }
                  fontSize={point.label === "START" ? 14 : 12}
                  textAnchor="middle"
                >
                  {point.label}
                </Text>
              </React.Fragment>
            ))}

            <Defs>
              <LinearGradient
                id="a"
                x1={150}
                x2={150}
                y1={-200}
                y2={totalHeight + 100}
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset={0} stopColor="#DBDBDB" />
                <Stop offset={0.45} stopColor="#DBDBDB" />
                <Stop offset={0.55} stopColor="#26456C" />
                <Stop offset={1} stopColor="#26456C" />
              </LinearGradient>
            </Defs>
          </Svg>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundImage: "linear-gradient(180deg, #26456C 0%, #DBDBDB 100%)",
  },
});

export default SvgComponent;
