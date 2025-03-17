import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Product from '@/components/Products/product'
import Title from '@/components/General/Title'

const product = () => {
  return (
    <View>
      <Title>Product</Title>
     <Product/>
    </View>
  )
}

export default product

const styles = StyleSheet.create({})