import { StyleSheet, View } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Avatar, Card ,Text,Button} from "react-native-paper";
import { theme } from "@/infrastructure/themes";


const CustomizedCard = ({height,children,}:any) => {
  return (
    <Card style ={{width: 325, height: height,backgroundColor: theme.colors.ui.screenbg,boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",borderRadius:8,borderColor:'#C5C5C5',borderWidth:0.3}}>
    <Card.Content >
      {children}
    </Card.Content>
  </Card>
  );
};

export default CustomizedCard;

const styles = StyleSheet.create({});
