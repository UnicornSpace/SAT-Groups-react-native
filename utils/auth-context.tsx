import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys - using consistent naming
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

  // Load auth state from AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const storedDriverId = await AsyncStorage.getItem(DRIVER_ID_KEY);
        const storedPoints = await AsyncStorage.getItem(POINTS_KEY);

        if (storedToken) setToken(storedToken);
        if (storedDriverId) setDriverId(Number(storedDriverId));
        if (storedPoints) setMyDynamicPointsState(Number(storedPoints));
        
        // Update authentication status based on token presence
        setIsAuthenticated(!!storedToken);
        
        console.log("Loaded user data from AsyncStorage");
      } catch (error) {
        console.error("Failed to load authentication data:", error);
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
      const storageOperations = [
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(DRIVER_ID_KEY, driverId.toString())
      ];
      
      if (points !== undefined) {
        storageOperations.push(AsyncStorage.setItem(POINTS_KEY, points.toString()));
        setMyDynamicPointsState(points);
      }
      
      await Promise.all(storageOperations);
      
      setToken(token);
      setDriverId(driverId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to save authentication data:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(DRIVER_ID_KEY),
        AsyncStorage.removeItem(POINTS_KEY)
      ]);
      
      await clearAuthData();
    } catch (error) {
      console.error("Failed to clear authentication data:", error);
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