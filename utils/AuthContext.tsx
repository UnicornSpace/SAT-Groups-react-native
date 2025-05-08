import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const AUTH_TOKEN_KEY = "auth_token";
const DRIVER_ID_KEY = "driver_id";
const POINTS_KEY = "dynamic_points";

type AuthContextType = {
  token: string | null;
  driverId: number | null;
  myDynamicPoints: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthData: (token: string, driverId: number) => Promise<void>;
  clearAuthData: () => Promise<void>;
  setMyDynamicPoints: (points: number) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [myDynamicPoints, setMyDynamicPointsState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const storedDriverId = await AsyncStorage.getItem(DRIVER_ID_KEY);
        const storedPoints = await AsyncStorage.getItem(POINTS_KEY);

        if (storedToken) setToken(storedToken);
        if (storedDriverId) setDriverId(Number(storedDriverId));
        if (storedPoints) setMyDynamicPointsState(Number(storedPoints));

        // console.log("Loaded user from AsyncStorage");
      } catch (error) {
        console.error("Failed to load authentication data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuthData();
  }, []);

  const setAuthData = async (token: string, driverId: number) => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(DRIVER_ID_KEY, driverId.toString());

      setToken(token);
      setDriverId(driverId);
    } catch (error) {
      console.error("Failed to save authentication data:", error);
    }
  };

  const setMyDynamicPoints = async (points: number) => {
    try {
      await AsyncStorage.setItem(POINTS_KEY, points.toString());
      setMyDynamicPointsState(points);
    } catch (error) {
      console.error("Failed to save points:", error);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, DRIVER_ID_KEY, POINTS_KEY]);

      setToken(null);
      setDriverId(null);
      setMyDynamicPointsState(null);
    } catch (error) {
      console.error("Failed to clear authentication data:", error);
    }
  };

  const logout = async () => {
    await clearAuthData();
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        driverId,
        myDynamicPoints,
        isLoading,
        isAuthenticated,
        setAuthData,
        clearAuthData,
        setMyDynamicPoints,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
