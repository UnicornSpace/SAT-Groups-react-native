

// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import Title from "@/components/General/Title";
// import ProductContainer from "@/components/Products/product";
// import OfferCard from "@/components/General/offer";

// import { useTranslation } from "react-i18next";
// const product = () => {
//   const {t} = useTranslation();
//   return (
//     <View style={styles.container}>
//       <Title>{t("Products")}</Title>
//       <View style={{ flexDirection: "row", flexWrap: "wrap", gap:27,justifyContent:"center",alignItems:"center",width:wp("100%") }}>
//         <ProductContainer />
//         <ProductContainer />
//       </View>
//        {/* <OfferCard /> */}
//     </View>
//   );
// };

// export default product;




import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const product = () => {
  return (
    <View style={styles.container}>
      <Text>MileStone</Text>
    </View>
  )
}

export default product

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    alignItems:"center",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(2.5),
    gap: 20,
  },
});
