import { ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '@/infrastructure/themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Svg, { Circle, G, Path,Text as SvgText } from 'react-native-svg';

const MilestonePath = ({refreshing,onRefresh,scrollRef,panResponder,svgWidth,totalSvgHeight,completedPath,remainingPath,points,iconPaths}:any) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ref={scrollRef}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
      style={styles.scrollView}
      // Remove panHandlers from ScrollView to prevent conflicts
    >
      <View
        style={styles.svgContainer}
        {...panResponder.panHandlers} // Apply panHandlers to the SVG container instead
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
                          <Text>START</Text>
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
    paddingTop: hp(20),
  },
  svgContainer: {
    flex: 1,
    minHeight: hp(100), // Ensure minimum height for proper touch handling
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    minHeight: hp(100),
  },
  // Modal Styles
  modalContent: {
    backgroundColor: "white",
    margin: wp(5),
    borderRadius: wp(3),
    maxHeight: hp(80),
    elevation: 5,
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: wp(5),
    color: "#26456C",
    fontFamily: theme.fontFamily.bold,
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: wp(5),
    color: "#666",
    fontFamily: theme.fontFamily.bold,
  },
  modalBody: {
    padding: wp(5),
  },
  milestoneInfoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: wp(5),
  },
  milestonePointsText: {
    fontSize: wp(6),
    fontFamily: theme.fontFamily.semiBold,
    color: "#26456C",
    textAlign: "center",
    marginBottom: wp(4),
  },
  rewardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: wp(3),
  },
  rewardLabel: {
    fontSize: wp(4),
    color: "#666",
    fontFamily: theme.fontFamily.medium,
  },
  rewardText: {
    fontSize: wp(4),
    color: "#26456C",
    fontFamily: theme.fontFamily.semiBold,
  },
  statusSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: wp(4),
  },
  statusLabel: {
    fontSize: wp(4),
    color: "#666",
    fontFamily: theme.fontFamily.medium,
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(3),
  },
  statusText: {
    color: "white",
    fontSize: wp(3.2),
    fontFamily: theme.fontFamily.semiBold,
  },
  progressSection: {
    marginTop: wp(4),
  },
  progressLabel: {
    fontSize: wp(3.5),
    color: "#666",
    marginBottom: wp(2),
    fontFamily: theme.fontFamily.medium,
  },
  progressBarContainer: {
    height: wp(2),
    backgroundColor: "#e0e0e0",
    borderRadius: wp(1),
    overflow: "hidden",
    marginBottom: wp(2),
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#26456C",
    borderRadius: wp(1),
  },
  progressPercentage: {
    fontSize: wp(3),
    color: "#26456C",
    textAlign: "right",
    fontFamily: theme.fontFamily.bold,
  },
  actionButton: {
    padding: wp(4),
    borderRadius: wp(2),
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: wp(4),
    fontFamily: theme.fontFamily.bold,
  },
  fixedProgressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingTop: hp(1.5),
    paddingBottom: hp(1.5),
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  progressCard: {
    padding: wp(4),
    backgroundColor: "#f5f5f5",
    borderRadius: wp(2),
    marginHorizontal: wp(4),
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsText: {
    fontSize: wp(4.8),
    color: "#26456C",
    // marginBottom: wp(2),
    fontFamily: theme.fontFamily.semiBold,
  },
  nextMilestoneContainer: {
    marginTop: wp(2),
  },
  milestoneText: {
    fontSize: wp(3.5),
    // color: "#666",
    marginBottom: wp(1),
    fontFamily: theme.fontFamily.light,
  },
});
