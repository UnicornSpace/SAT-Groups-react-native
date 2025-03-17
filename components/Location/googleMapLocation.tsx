import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

const openInGoogleMaps = async (destination:any) => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Location Permission Required',
      'Allow location access to use this feature smoothly.',
      [
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(destination)}`;
  Linking.openURL(url);
};

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => openInGoogleMaps('Taj Mahal')}
        style={{
          backgroundColor: '#222222',
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
          Navigate to Taj Mahal
        </Text>
      </TouchableOpacity>
    </View>
  );
}
