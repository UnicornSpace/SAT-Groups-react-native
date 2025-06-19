import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { theme } from '@/infrastructure/themes';
import ReferralStepsVisual from './referal-steps';
import { t } from 'i18next';
import ReferralQR from './referral-qr';
const RefferalSteps = () => {
 

  return (
    <ScrollView>
      <View style={{padding:wp(5),display:'flex',gap:hp(3) }}>
      <View style={{}}>
      <Text style={{fontFamily:theme.fontFamily.medium,fontSize:theme.fontSize.medium}}>{t("How to earn 100 points")}</Text>
      <Text style={{fontFamily:theme.fontFamily.regular,fontSize:theme.fontSize.caption+1 }}>{t("Follow the steps below and get rewards and points")}</Text>
      </View>
      <ReferralStepsVisual/>
      <View>
        <Text style={{fontFamily:theme.fontFamily.medium,fontSize:theme.fontSize.medium -1}}>{t("Scan the QR code to get 100 points")}</Text>
      </View>
      <ReferralQR/>
    </View>
    </ScrollView>
  )
}

export default RefferalSteps

const styles = StyleSheet.create({})