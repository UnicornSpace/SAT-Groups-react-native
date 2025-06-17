import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/utils/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '@/infrastructure/themes';
import { t } from 'i18next';
const ReferralQR = () => {
 const { driverId} = useAuth()
  
const referralLink = `https://play.google.com/store/apps/details?id=com.satgroups.app&referrer=ref_${driverId}`

 

  const shareReferralLink = async () => {
    try {
      await Share.share({
        message: `Join me on this amazing app! Use my referral code: ${driverId}\n\nDownload here: ${referralLink}`,
        url: referralLink,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share referral link');
    }
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Share & Earn Rewards</Text> */}
      
      <View style={styles.qrContainer}>
        <QRCode
        
          value={referralLink}
          size={200}
          backgroundColor="white"
          color="black"
        />
      </View>
      
      <Text style={styles.linkText}>
        {t("Friends scan this QR code to download the app with your referral code!")}
      </Text>
      
      {/* <Text style={styles.userId}>
        Your ID: {driverId}
      </Text> */}
      
      <TouchableOpacity style={styles.shareButton} onPress={shareReferralLink}>
        <Text style={styles.shareButtonText}>{t("Share Link")}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ReferralQR

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: theme.fontSize.medium,
    // fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    fontFamily: theme.fontFamily.medium,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userId: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  shareButton: {
    backgroundColor: theme.colors.brand.blue,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})