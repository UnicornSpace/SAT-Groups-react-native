import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { Modal, Portal } from 'react-native-paper';
import { theme } from '@/infrastructure/themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { t } from 'i18next';


const MilestoneModal = ({visible,hideModal,selectedMilestone,totalPoints,progressPercentage,handleClaim,claiming}:any) => {
  return (
     <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("Milestone Details")}</Text>
            <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {selectedMilestone && (
            <View style={styles.modalBody}>
              <View style={styles.milestoneInfoCard}>
                <Text style={styles.milestonePointsText}>
                  {selectedMilestone.requiredPoints} {t("Points Required")}
                </Text>

                <View style={styles.rewardSection}>
                  <Text style={styles.rewardLabel}>{t("Reward")}:</Text>
                  <Text style={styles.rewardText}>
                    {selectedMilestone.rewardType === "Gift"
                      ? "🎁 Special Gift"
                      : `${selectedMilestone.rewardPoints} Points`}
                  </Text>
                </View>

                <View style={styles.statusSection}>
                  <Text style={styles.statusLabel}>{("Status")}:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: selectedMilestone.isAchieved
                          ? "#4CAF50"
                          : selectedMilestone.isCurrent
                          ? "#FF9800"
                          : "#9E9E9E",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {selectedMilestone.isAchieved
                        ? "Achieved"
                        : selectedMilestone.isCurrent
                        ? "In Progress"
                        : "Locked"}
                    </Text>
                  </View>
                </View>

                {selectedMilestone.isCurrent && (
                  <View style={styles.progressSection}>
                    <Text style={styles.progressLabel}>
                      Progress: {totalPoints} /{" "}
                      {selectedMilestone.requiredPoints}
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${progressPercentage}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressPercentage}>
                      {progressPercentage}% Complete
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      selectedMilestone.isAchieved &&
                      selectedMilestone.status === "unclaimed"
                        ? "#4CAF50"
                        : "#ccc",
                    opacity: claiming ? 0.7 : 1, // Reduce opacity when claiming
                  },
                ]}
                disabled={
                  !selectedMilestone.isAchieved ||
                  selectedMilestone.status === "claimed" ||
                  claiming // Disable button when claiming
                }
                onPress={() => {
                  if (
                    selectedMilestone.isAchieved &&
                    selectedMilestone.status === "unclaimed" &&
                    !claiming
                  ) {
                    handleClaim(selectedMilestone);
                  }
                }}
              >
                {claiming ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator 
                      size="small" 
                      color="white" 
                      style={styles.loadingSpinner}
                    />
                    <Text style={styles.loadingText}>
                      Claiming...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.actionButtonText,
                      {
                        color:
                          selectedMilestone.isAchieved &&
                          selectedMilestone.status === "unclaimed"
                            ? "white"
                            : "#666",
                      },
                    ]}
                  >
                    {selectedMilestone.status === "claimed"
                      ? "Already Claimed"
                      : selectedMilestone.isAchieved
                      ? "Claim Reward"
                      : "Not Available"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Modal>
      </Portal>
  )
}

export default MilestoneModal

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
    justifyContent: "center",
    minHeight: wp(12), // Ensure consistent height
  },
  actionButtonText: {
    fontSize: wp(4),
    fontFamily: theme.fontFamily.bold,
  },
  // Loading styles
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingSpinner: {
    marginRight: wp(2),
  },
  loadingText: {
    fontSize: wp(4),
    color: "white",
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