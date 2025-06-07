import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/infrastructure/themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const LocationIcon = () => {
  return (
    <TouchableOpacity
     
      style={styles.editbtn}
    >
     <FontAwesome5 name="location-arrow" size={19} color={theme.colors.brand.blue} />
      {/* <Feather name="arrow-up-right" size={24} color={theme.colors.brand.blue} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editbtn: {
      backgroundColor: "#fff",
      borderRadius: 100,
      width: wp(12),
      height: hp(6),
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      margin: wp(3.5),
    },
})
export default LocationIcon