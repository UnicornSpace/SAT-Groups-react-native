import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '@/infrastructure/themes';

const EditButton = ()=>{
  return (
    <TouchableOpacity style={styles.editbtn}>
      {/* <Ionicons name="pencil" size={20} color="black" /> */}
      {/* <FontAwesome name="pencil" size={20} color="black" /> */}
      <FontAwesome5 name="user-edit" size={16} color={theme.colors.brand.blue} />
    </TouchableOpacity>

  )
}
const PersonDetails = ()=>{
  return (
  <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center",gap:wp(4), }}>
    <TouchableOpacity style={styles.userbtn}>
      {/* <Ionicons name="pencil" size={20} color="black" /> */}
      <FontAwesome name="user" size={20} color={theme.colors.brand.blue} />
      {/* <FontAwesome5 name="user" size={16} color={theme.colors.brand.blue} /> */}
    </TouchableOpacity>
    <View style={{display:"flex", flexDirection:"column",}}>
      <Text style={{fontFamily:theme.fontFamily.regular , fontSize:hp(1.5),color:"#8E8F8F"}}>Age</Text>
      <Text  style={{fontFamily:theme.fontFamily.semiBold , fontSize:hp(2),color:theme.colors.brand.blue}}>35 years</Text>
    </View>
  </View>

  )
}



const UserDetails = () => {
  const { t } = useTranslation();
  return (
    <View style={{}}>
      <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", width:wp(85), alignItems:"center",}}>	
      <Text style ={{fontSize:hp(2.5),fontFamily:theme.fontFamily.medium}}>{t("Personal Details")}</Text>
      <EditButton/>
      </View>
      <View style={styles.container}>
      <PersonDetails/>
    </View>
    </View>
  )
}

export default UserDetails

const styles = StyleSheet.create({
  container: {
    width: wp(85),


  },
  editbtn: {
    backgroundColor: '#F2F3F5',
    borderRadius: 100,
    width:wp(12),
    height:hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  userbtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    width:wp(13),
    height:hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
})