import { ImageBackground, RefreshControl, ScrollView, StyleSheet, Text,  View } from 'react-native'
import React from 'react'
import { theme } from '@/infrastructure/themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Svg, { Circle, G, Path,Text as SvgText } from 'react-native-svg';

const MilestonePath = ({
  refreshing,
  onRefresh,
  scrollRef,
  panResponder,
  svgWidth,
  totalSvgHeight,
  completedPath,
  remainingPath,
  points,
  iconPaths,
  onScroll,
  scrollEventThrottle
}: any) => {
  return (
    <ScrollView
    
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ref={scrollRef}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
      style={styles.scrollView}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      <View
        style={styles.svgContainer}
        {...panResponder.panHandlers}
      >
        <ImageBackground
          // @ts-ignore
          opacity={0.3}
          source={require("@/assets/images/satgroups/milestone-background.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <Svg
            width={svgWidth}
            height={totalSvgHeight}
            viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
          >
            <G>
              {completedPath && (
                <Path
                  stroke="#26456C"
                  strokeLinecap="square"
                  strokeWidth={wp(8)}
                  d={completedPath}
                />
              )}

              {remainingPath && (
                <Path
                  stroke="#DBDBDB"
                  strokeLinecap="square"
                  strokeWidth={wp(8)}
                  d={remainingPath}
                />
              )}

              {points.map((point:any, index:any) => {
                const isStart = index === 0;
                const circleRadius = isStart ? wp(10) : wp(6);
                const labelOffset = isStart ? wp(1.5) : wp(9);
                const isEven = index % 2 === 0;

                const labelX = isStart
                  ? point.x
                  : isEven && !isStart
                  ? point.x - wp(2.5)
                  : point.x + wp(2.5);

                return (
                  <React.Fragment key={index}>
                    <Circle
                      cx={point.x}
                      cy={point.y}
                      r={circleRadius}
                      fill={
                        point.isAchieved
                          ? "#26456C"
                          : isStart
                          ? "#26456C"
                          : point.isCurrent
                          ? "#fff"
                          : "#DBDBDB"
                      }
                      stroke={
                        isStart ? "#fff" : point.isCurrent ? "#26456C" : "#fff"
                      }
                      strokeWidth={point.isCurrent ? wp(1.5) : wp(0.8)}
                    />

                    {point.rewardType && (
                      <G
                        transform={`translate(${point.x - wp(2.5)}, ${
                          point.y - wp(2.5)
                        }) scale(${wp(0.2)})`}
                        fill={
                          point.isAchieved || isStart
                            ? "#fff"
                            : point.isCurrent
                            ? "#26456C"
                            : "#fff"
                        }
                      >
                        {isStart ? (
                          <Text></Text>
                        ) : (
                          <Path d={iconPaths[point.rewardType]} />
                        )}
                      </G>
                    )}

                    <SvgText
                      x={
                        isStart
                          ? point.x
                          : isEven && !isStart
                          ? labelX - wp(2.5)
                          : labelX + wp(2.5)
                      }
                      y={point.y + labelOffset}
                      fill={isStart ? "#fff" : "#26456C"}
                      fontFamily={
                        isStart
                          ? theme.fontFamily.bold
                          : theme.fontFamily.regular
                      }
                      fontSize={isStart ? wp(4) : wp(4)}
                      textAnchor={
                        isStart
                          ? "middle"
                          : isEven && !isStart
                          ? "end"
                          : "start"
                      }
                    >
                      {isStart ? "START" : point.points + " L"}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </G>
          </Svg>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

export default MilestonePath;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: hp(18),
  },
  svgContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    minHeight: hp(100),
  },
});