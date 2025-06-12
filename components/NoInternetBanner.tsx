// components/NoInternetScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoInternetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>Please check your connection and try again.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f87171', // red-400
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
});
