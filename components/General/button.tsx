import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'

const ActiveButtonContainer = styled.TouchableOpacity`
width: 80%;
height: 25%;
background-color: ${(props:any)=>props.theme.colors.ButtonColor.activebackgroundColor};
border-radius: 10px;
justify-content: center;
`
const InActiveButtonContainer = styled.TouchableOpacity`
width: 80%;
height: 25%;
background-color: ${(props:any)=>props.theme.colors.ButtonColor.disablebackgroundColor};
border-radius: 10px;
justify-content: center;
`

const ButtonTitle = styled.Text`
  color: ${(props:any)=>props.theme.colors.text.primary};
  font-size: ${(props:any)=>props.theme.fontSize.p}px;
  font-family: ${(props:any)=>props.theme.fontFamily.semiBold};
  text-align: center;
  `


const ActiveButtonCustomized = ({title,}:any) => {
  return (
    <ActiveButtonContainer >
      <ButtonTitle >{title}</ButtonTitle>
    </ActiveButtonContainer>

  )
}
const InActiveButtonCustomized = ({title,}:any) => {
  return (
    
    <InActiveButtonContainer >
    <ButtonTitle >{title}</ButtonTitle>
  </InActiveButtonContainer>
  )
}

export default {ActiveButtonCustomized,InActiveButtonCustomized}

const styles = StyleSheet.create({})