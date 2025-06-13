import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Network from 'expo-network';

interface NetworkState {
  isConnected: boolean | null;
  connectionType: string;
}

const InternetDetector: React.FC = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    connectionType: 'unknown'
  });

  const checkNetworkState = async (): Promise<void> => {
    try {
      const state = await Network.getNetworkStateAsync();
      
      setNetworkState({
        isConnected: state.isConnected ?? false,
        connectionType: state.type === Network.NetworkStateType.WIFI 
          ? 'wifi' 
          : state.type === Network.NetworkStateType.CELLULAR 
          ? 'cellular' 
          : state.type === Network.NetworkStateType.NONE
          ? 'none'
          : 'unknown'
      });
    } catch (error) {
      console.error('Network check failed:', error);
      setNetworkState({
        isConnected: false,
        connectionType: 'error'
      });
    }
  };

  useEffect(() => {
    // Check initial network state
    checkNetworkState();

    // Set up interval to check network state every 2 seconds
    const interval = setInterval(checkNetworkState, 2000);

    return () => clearInterval(interval);
  }, []);

  const showDetailedInfo = async (): Promise<void> => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const ipAddress = await Network.getIpAddressAsync();
      
      Alert.alert(
        'Network Details',
        `Connected: ${networkState.isConnected ? 'Yes' : 'No'}\n` +
        `Type: ${networkState.type === Network.NetworkStateType.WIFI ? 'WiFi' : 
                 networkState.type === Network.NetworkStateType.CELLULAR ? 'Cellular' :
                 networkState.type === Network.NetworkStateType.NONE ? 'None' : 'Unknown'}\n` +
        `IP Address: ${ipAddress || 'Unavailable'}\n` +
        `Internet Reachable: ${networkState.isInternetReachable ? 'Yes' : 'No'}`
      );
    } catch (error) {
      Alert.alert('Error', `Failed to get network details: ${error}`);
    }
  };

  const getConnectionStatus = (): string => {
    if (networkState.isConnected === null) return 'Checking...';
    if (networkState.isConnected === false) return 'No Internet';
    return 'Connected';
  };

  const getStatusColor = (): string => {
    if (networkState.isConnected === null) return '#FFA500'; // Orange for loading
    if (networkState.isConnected === false) return '#FF4444'; // Red for no connection
    return '#44FF44'; // Green for connected
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Internet Connection Status</Text>
      
      <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getConnectionStatus()}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Connection Type: {networkState.connectionType}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={showDetailedInfo}>
        <Text style={styles.buttonText}>Show Network Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.refreshButton]} onPress={checkNetworkState}>
        <Text style={styles.buttonText}>Refresh Status</Text>
      </TouchableOpacity>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to test:</Text>
        <Text style={styles.instructionsText}>
          • Turn off WiFi and mobile data to see "No Internet"
        </Text>
        <Text style={styles.instructionsText}>
          • Turn on WiFi → Should show "Connected" with type "wifi"
        </Text>
        <Text style={styles.instructionsText}>
          • Turn off WiFi, turn on mobile data → Shows "cellular"
        </Text>
        <Text style={styles.instructionsText}>
          • Tap buttons for more info or manual refresh
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  statusContainer: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    minWidth: 250,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  refreshButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    maxWidth: 300,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default InternetDetector;