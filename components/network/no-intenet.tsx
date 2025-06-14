// NoInternetScreen.tsx - Simple no internet screen
import { theme } from '@/infrastructure/themes';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NoInternetScreenProps {
  onRetry: () => void;
}

const NoInternetScreen: React.FC<NoInternetScreenProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📵</Text>
      <Text style={styles.title}>No Internet</Text>
      <Text style={styles.message}>Please check your connection</Text>
      
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily:theme.fontFamily.extrabold
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily:theme.fontFamily.medium
  },
  button: {
    backgroundColor: theme.colors.brand.blue,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily:theme.fontFamily.semiBold
  },
});

export default NoInternetScreen;