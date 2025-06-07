import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/infrastructure/themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const EditButton = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push("/(screens)/edit-user")}
      style={styles.editbtn}
    >
      {/* <Ionicons name="pencil" size={20} color="black" /> */}
      {/* <FontAwesome name="pencil" size={20} color="black" /> */}
      <FontAwesome5
        name="user-edit"
        size={16}
        color={theme.colors.brand.blue}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editbtn: {
      backgroundColor: "#F2F3F5",
      borderRadius: 100,
      width: wp(12),
      height: hp(6),
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      margin: wp(3.5),
    },
})
export default EditButton