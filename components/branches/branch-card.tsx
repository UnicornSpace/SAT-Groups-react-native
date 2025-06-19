import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { theme } from "@/infrastructure/themes";
import { useTranslation } from "react-i18next";

const LocationCard = ({ item, onPress, sentenceCase }:any) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      key={item.location_code}
      onPress={() => onPress(item.google_map_link)}
      style={styles.card}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Left side - Location icon and name */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <FontAwesome 
              name="map-marker" 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          <Text style={styles.locationName}>
            {sentenceCase(item.location_name) || t("Branch")}
          </Text>
        </View>

        {/* Right side - Distance and Duration */}
        <View style={styles.rightSection}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <FontAwesome 
                name="map-pin" 
                size={12} 
                color="#6B7280" 
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Distance</Text>
            </View>
            <Text style={styles.infoValue}>
              {item.distance ? `${item.distance} KM` : "12 KM"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={12}
                color="#6B7280"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Duration</Text>
            </View>
            <Text style={styles.infoValue}>
              {item.duration || "1 hrs"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Example usage component
const LocationList = ({ locations, openInGoogleMaps, sentenceCase }:any) => {
  return (
    <View style={styles.container}>
      {locations.map(({item, index}:any) => (
        <LocationCard
          key={item.location_code || index}
          item={item}
          onPress={openInGoogleMaps}
          sentenceCase={sentenceCase}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: hp(2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  locationName: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    maxWidth: wp(35),
  },
  rightSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(0.5),
    
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.3),
  },
  infoIcon: {
    marginRight: 4,
  },
  infoLabel: {
    fontSize: hp(1.4),
    color: '#6B7280',
    fontWeight: '400',
  },
  infoValue: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default LocationCard;
export { LocationList };