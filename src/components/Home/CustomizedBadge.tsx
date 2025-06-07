import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { width, height, size, fontSize } from "react-native-responsive-sizes";
import { theme } from '@/infrastructure/themes';
const CustomizedBadge = ({userInfo}:any) => {
  return (
    <View style={styles.badge}>
      <Text style={{color:theme.colors.text.primary,fontFamily: theme.fontFamily.semiBold,fontSize: fontSize(16),}}>{userInfo}</Text>
    </View>
  )
}

export default CustomizedBadge

const styles = StyleSheet.create({
  badge: {
    width: size(40),
    height: size(40),
    borderRadius: 50,
    backgroundColor: theme.colors.brand.blue,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
})