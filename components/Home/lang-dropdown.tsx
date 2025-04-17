import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "@/infrastructure/themes";
import i18n from "i18next";
const data = [
  { label: "ENG", value: "1" ,trans:"en"},
  { label: "ಕನ್ನಡ", value: "2" ,trans:"kan"},
  { label: "हिन्दी", value: "3" ,trans:"hi"},
  { label: "తెలుగు", value: "4",trans:"tel" },
  { label: "తెలుగు", value: "5" ,trans:"tam"},
];

const LanguageSelection = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);


  return (
    <View style={styles.container}>
      {/* {renderLabel()} */}
      {/* <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        // search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "ENG" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          
          i18n.changeLanguage(item.trans);
          console.log(item.label);
        }}
        renderLeftIcon={() => (
          // <Ionicons name="language-sharp" size={18} color="" />
          <MaterialIcons name="language" size={18} color="black" />
        )}
      /> */}


    </View>
  );
};

export default LanguageSelection;

const styles = StyleSheet.create({
  container: {
    width: "37%",
    padding: 14,
  },
  dropdown: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
  },
  selectedTextStyle: {
    fontSize: 12,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.ui.black,
    // fontWeight: 'bold',
    marginLeft: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: "black",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
});
