import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import axios from 'axios';

export default function App() {
  useEffect(() => {
    const register = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const { data: token } = await Notifications.getExpoPushTokenAsync();

      // Save token via your REST API
      await axios.post('https://your-api.com/save-token', {
        userId: 'driver123',
        token,
      });
    };

    register();
  }, []);

  return App; // your screens
}
// ✅ 2. To Send Notification — Use Axios or Postman
// If you have a backend:
// await axios.post('https://your-api.com/send-to-all', {
//   message: '🚗 New job nearby!'
// });
