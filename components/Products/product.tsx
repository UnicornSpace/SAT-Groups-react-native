import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { theme } from "@/infrastructure/themes";

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const ProductContainer = () => {
  return (
    <View>
      <View style={styles.container}>
        <ImageContainer />
        <TextContainer />
        <QuantityBanner />
      </View>
     
    </View>
  );
};

export default ProductContainer;

const ImageContainer = () => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={require("@/assets/images/satgroups/product.png")}
        resizeMode="cover"
        width={wp("33%")}
        height={hp("16%")}
      />
    </View>
  );
};

const TextContainer = () => {
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: hp(2.1),
            fontFamily: theme.fontFamily.semiBold,
          }}
        >
          Adblue
        </Text>
        <Text
          style={{
            fontSize: hp(2),
            fontFamily: theme.fontFamily.bold,
            color: theme.colors.brand.blue,
          }}
        >
          $50
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row" }}>
        {/* <TouchableOpacity style={styles.addBtn} ><Text style={styles.addText}>Add to Cart</Text></TouchableOpacity> */}
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyText}>Buy now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const QuantityBanner = () => {
  return(
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityContainerText}>1000L</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp("41%"),
    // height: hp("31%"),
    backgroundColor: "#F2F3F5",
    borderRadius: 8,
    padding: 10,
    display: "flex",
    gap: 15,
    // justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    position: "relative",
    // boxShadow:"0px 3px 3px rgba(0, 0, 0, 0.25)",
  },
  imageContainer: {
    width: wp('33%'),
    height: hp('16%'),
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: wp("30%"),
    height: hp("5%"),
    borderColor: "#26456C",
    borderWidth: 1,
    borderRadius: 4,
  },
  buyBtn: {
    width: wp("30%"),
    height: hp("5%"),
    backgroundColor: theme.colors.brand.blue,
    borderWidth: 1,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buyText: {
    color: theme.colors.text.primary,
    fontSize: hp(1.8),
    textAlign: "center",
    fontFamily: theme.fontFamily.medium,
  },
  quantityContainer:{
    width: wp("9.5%"),
    height: hp("4.7%"),
    backgroundColor: theme.colors.brand.blue,
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 5,
    position: "absolute",
    right: 5,
    top: 5,
  },
  quantityContainerText:{
    fontSize: hp(1.3),
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.text.primary,
    textAlign: "center",
    
  }
});
