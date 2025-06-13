import { Redirect } from 'expo-router';
import { useAuth } from '@/utils/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(screens)/LanguageSeletionScreen" />;
  }

  return <Redirect href="/(tabs)" />;
}