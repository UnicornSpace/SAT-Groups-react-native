import { useEffect, useState } from "react"
import * as Network from 'expo-network';

export const useInternetStatus = () => {
  const [isConnected, setisConnected] = useState(true)

  const checkInternet = async () => {
    try {
      const state = await Network.getNetworkStateAsync()
      // console.log("✅✅", state)
      setisConnected(state.isConnected ?? false)
    } catch (error) {
      setisConnected(false)
    }
  }
  useEffect(() => {
    checkInternet()
    const interval = setInterval(checkInternet, 5000);

    return () => clearInterval(interval);
  }, [])
  return {
    isConnected,
    checkInternet
  }
}