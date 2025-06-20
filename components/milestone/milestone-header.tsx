import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { t } from "i18next";
import { theme } from "@/infrastructure/themes";
const MilestoneHeader = ({totalPoints,milestones,currentMilestone,progressPercentage}:any) => {
  
  return (
    <View style={styles.fixedProgressContainer}>
      <View style={styles.progressCard}>
        <Text style={styles.pointsText}>
          {t("Total Liters")}: {totalPoints}
        </Text>
        <View style={styles.nextMilestoneContainer}>
          <Text style={styles.milestoneText}>
            {totalPoints >=
            (Number(milestones[milestones.length - 1]?.requiredPoints) || 0)
              ? t("All milestones achieved")
              : currentMilestone
              ? `${progressPercentage}% to ${currentMilestone.requiredPoints} L`
              : "Loading milestones..."}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MilestoneHeader;

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
