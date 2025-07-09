import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDetails } from "@/api/user-details";
import { router } from "expo-router";

const AUTH_TOKEN_KEY = "authToken";
const DRIVER_ID_KEY = "driverId";
const POINTS_KEY = "dynamicPoints";

type AuthContextType = {
  token: string | null;
  driverId: number | null;
  myDynamicPoints: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthData: (token: string, driverId: number) => Promise<void>;
  clearAuthData: () => Promise<void>;
  setMyDynamicPoints: (points: number) => Promise<void>;
  login: (token: string, driverId: number, points?: number) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [myDynamicPoints, setMyDynamicPointsState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const validateUserToken = async (driverId: number, token: string) => {
    try {
      const response = await getUserDetails(driverId, token);
      if (!response?.driver) {
        await logout();
        router.replace("/(screens)/language-selection-screen");
      }
    } catch (error) {
      console.log("❌ Token expired or invalid. Logging out...");
      await logout();
      router.replace("/(screens)/language-selection-screen");
    }
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const storedDriverId = await AsyncStorage.getItem(DRIVER_ID_KEY);
        const storedPoints = await AsyncStorage.getItem(POINTS_KEY);

        if (storedToken) setToken(storedToken);
        if (storedDriverId) setDriverId(Number(storedDriverId));
        if (storedPoints) setMyDynamicPointsState(Number(storedPoints));
        setIsAuthenticated(!!storedToken);

        if (storedToken && storedDriverId) {
          await validateUserToken(Number(storedDriverId), storedToken);
        }

        console.log("✅ Loaded and validated user from AsyncStorage");
      } catch (error) {
        console.error("❌ Failed to load authentication data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const setAuthData = async (token: string, driverId: number) => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(DRIVER_ID_KEY, driverId.toString());
      setToken(token);
      setDriverId(driverId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to save authentication data:", error);
      throw error;
    }
  };

  const setMyDynamicPoints = async (points: number) => {
    try {
      await AsyncStorage.setItem(POINTS_KEY, points.toString());
      setMyDynamicPointsState(points);
    } catch (error) {
      console.error("Failed to save points:", error);
      throw error;
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        DRIVER_ID_KEY,
        POINTS_KEY,
      ]);
      setToken(null);
      setDriverId(null);
      setMyDynamicPointsState(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to clear authentication data:", error);
      throw error;
    }
  };

  const login = async (token: string, driverId: number, points?: number) => {
    try {
      const storageOps = [
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(DRIVER_ID_KEY, driverId.toString()),
      ];

      if (points !== undefined) {
        storageOps.push(AsyncStorage.setItem(POINTS_KEY, points.toString()));
        setMyDynamicPointsState(points);
      }

      await Promise.all(storageOps);

      setToken(token);
      setDriverId(driverId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

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
        login,
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
