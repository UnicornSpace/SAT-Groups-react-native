import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
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

  const points = [
    { x: 160, y: 490, label: "START" },
    { x: 30, y: 448, label: "100" },
    { x: 288, y: 385, label: "200" },
    { x: 40, y: 315, label: "400" },
    { x: 275, y: 250, label: "200" },
    { x: 60, y: 175, label: "400" },
    { x: 260, y: 105, label: "200" },
    { x: 100, y: 25, label: "200" },
    { x: 55, y: 15, label: "400" },
  ];

  // Calculate total height for scrollable area
  const totalHeight = Math.max(...points.map((p) => p.y)) + 100;

  // Scroll to bottom on mount
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, []);

  const pathDefinition =
    "M162.443 448.5 S-172.204 395  143.708 366 s0 -66.5 0 -66.5 s-284.903 -35 0 -64.5 c284.902 -29.5 0 -71 0 -71 s-247.434 -37.5 0 -71.5 s0 -84.5 0 -84.5  s -247.434,-37.5 0,-71.5  s 0,-84.5 0,-84.5 s -247.434,-37.5 0,-71.5 s 0,-84.5 0,-84.5 ";

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={{ height: totalHeight + 300 }}>
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
                r={point.label === "START" ? 30 : 20}
                fill={point.label === "START" ? "#26456C" : "#fff"}
                stroke={point.label === "START" ? "none" : "#26456C"}
                strokeWidth={2}
              />
              <Text
                x={point.x}
                y={point.y + 5}
                fill={point.label === "START" ? "#fff" : "#26456C"}
                fontFamily="Arial"
                fontSize={12}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
});

export default SvgComponent;
