import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MilestoneProgressPath from '@/components/milestone2'

const milestone = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MilestoneProgressPath/>
    </View>
  )
}

export default milestone

const styles = StyleSheet.create({})