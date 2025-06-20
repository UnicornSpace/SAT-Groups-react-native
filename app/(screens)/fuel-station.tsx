import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/infrastructure/themes";
import { t } from "i18next";
import LoadingDots from "@/components/branches/dot-animation";

const { width } = Dimensions.get("window");

interface FuelStationDetailsProps {
  onBack?: () => void;
  onViewMap?: () => void;
  onCallPhone?: (phone: string) => void;
  data: any;
}

const FuelStationDetails: React.FC<FuelStationDetailsProps> = ({
  onBack,
  onViewMap,
  onCallPhone,
  data,
}) => {
  const handlePhoneCall = (phoneNumber: string) => {
    if (onCallPhone) {
      onCallPhone(phoneNumber);
    } else {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };
  const distance = data.calculatedDistance || data.distance || <LoadingDots style={{ fontSize: 13, color: theme.colors.brand.blue }}  />;
  const duration = data.calculatedDuration || data.duration || <LoadingDots style={{ fontSize: 13, color: theme.colors.brand.blue }}  />;
  const userLocation = data.userLocation;

  const QuickActionButton = ({
    icon,
    label,
    onPress,
    color = "#4A90E2",
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const InfoCard = ({
    icon,
    title,
    value,
    onPress,
    actionIcon,
    iconColor = "#6B7280",
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value: string;
    onPress?: () => void;
    actionIcon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
  }) => (
    <TouchableOpacity
      style={styles.infoCard}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.infoCardContent}>
        <View style={[styles.infoIcon, { backgroundColor: iconColor + "15" }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>{title}</Text>
          <Text style={styles.infoValue} numberOfLines={2}>
            {value}
          </Text>
        </View>
        {actionIcon && (
          <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <Ionicons name={actionIcon} size={20} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("Station Details")}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.brandContainer}>
            <Image
              source={{ uri: data.brand_logo }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            {/* <View style={styles.stationBadge}>
              <Text style={styles.badgeText}>{data.brand}</Text>
            </View> */}
          </View>

          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{data.location_name}</Text>
            <Text style={styles.locationCode}>Code: {data.location_code}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{t("Quick Actions")}</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton
              icon="call"
              label={t("Call")}
              color="#10B981"
              onPress={() => handlePhoneCall(data.phone_no)}
            />
            <QuickActionButton
              icon="mail"
              label={t("Email")}
              color="#F59E0B"
              onPress={() => Linking.openURL(`mailto:${data.email_id}`)}
            />
            <QuickActionButton
              icon="navigate"
              label={t("Directions")}
              color="#3B82F6"
              onPress={() => Linking.openURL(`${data.google_map_link}`)}
            />
            {/* <QuickActionButton
              icon="share-outline"
              label="Share"
              color="#8B5CF6"
              onPress={() => {}}
            /> */}
          </View>
        </View>

        {/* Station Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Station Information</Text>

          

          <InfoCard
            icon="location"
            title={t("Distance")}
            value={distance}
            iconColor="#10B981"
            actionIcon="location"
            onPress={() => handlePhoneCall(data.address)}
          />
          <InfoCard
            icon="time"
            title="Duration"
            value={duration}
            iconColor="#EF4444"
            actionIcon="hourglass"
            onPress={()=> Linking.openURL(`${data.address}`)}
          />
          <InfoCard
            icon="call"
            title={t("Phone Number")}
            value={data.phone_no}
            iconColor="#10B981"
            actionIcon="call"
            onPress={() => handlePhoneCall(data.phone_no)}
          />

          <InfoCard
            icon="phone-portrait"
            title={t("Mobile Number")}
            value={data.mobile_no}
            iconColor="#3B82F5"
            actionIcon="call"
            onPress={() => handlePhoneCall(data.mobile_no)}
          />

          <InfoCard
            icon="mail"
            title={t("Email Address")}
            value={data.email_id}
            iconColor="#F59E0B"
            actionIcon="mail"
            onPress={() => Linking.openURL(`mailto:${data.email_id}`)}
          />

          <InfoCard
            icon="business"
            title={t("Brand")}
            value={data.brand}
            iconColor="#8B5CF6"
          />
         
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    // backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: theme.fontFamily.medium,
  },

  scrollView: {
    flex: 1,
  },
  heroSection: {
    // backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    marginBottom: 12,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  brandLogo: {
    width: width * 0.8,
    height: 160,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  stationBadge: {
    position: "absolute",
    top: 12,
    right: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: theme.fontFamily.semiBold,
  },
  stationInfo: {
    alignItems: "center",
  },
  stationName: {
    fontSize: 20,
    color: theme.colors.brand.blue,
    textAlign: "center",
    fontFamily: theme.fontFamily.bold,
  },
  locationCode: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: theme.fontFamily.regular,
  },
  quickActionsSection: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
    alignSelf: "center",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    fontFamily: theme.fontFamily.semiBold,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickActionButton: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily.medium,
    color: "#6B7280",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 12,
  },
  infoCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  infoCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: "#6B7280",
    // marginBottom: 2,
    fontFamily: theme.fontFamily.medium,
  },
  infoValue: {
    fontSize: 13,
    // fontWeight: '600',
    color: "#1F2937",
    // lineHeight: 1,
    fontFamily: theme.fontFamily.light,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default FuelStationDetails;
