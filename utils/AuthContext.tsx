import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  driverId: number | null;
  setAuthData: (token: string, driverId: number) => void;
  clearAuthData: () => void;
  setMyDynamicPoints: (points: number) => void;
  myDynamicPoints: number | null;
  isAuthenticated: boolean;
  login: (token: string, driverId: number, points?: number) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [myDynamicPoints, setMyDynamicPointsState] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [storedToken, storedDriverId, storedPoints] = await Promise.all([
          AsyncStorage.getItem("authToken"),
          AsyncStorage.getItem("driverId"),
          AsyncStorage.getItem("dynamicPoints")
        ]);
        
        if (storedToken && storedDriverId) {
          setToken(storedToken);
          setDriverId(parseInt(storedDriverId));
          if (storedPoints) {
            setMyDynamicPointsState(parseInt(storedPoints));
          }
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to load authentication state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthState();
  }, []);

  const setAuthData = (token: string, driverId: number) => {
    setToken(token);
    setDriverId(driverId);
    setIsAuthenticated(true);
  };

  const clearAuthData = () => {
    setToken(null);
    setDriverId(null);
    setMyDynamicPointsState(null);
    setIsAuthenticated(false);
  };

  const setMyDynamicPoints = async (points: number) => {
    setMyDynamicPointsState(points);
    await AsyncStorage.setItem("dynamicPoints", points.toString());
  };

  const login = async (token: string, driverId: number, points?: number) => {
    try {
      const storageOperations = [
        AsyncStorage.setItem("authToken", token),
        AsyncStorage.setItem("driverId", driverId.toString())
      ];
      
      if (points !== undefined) {
        storageOperations.push(AsyncStorage.setItem("dynamicPoints", points.toString()));
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
        AsyncStorage.removeItem("authToken"),
        AsyncStorage.removeItem("driverId"),
        AsyncStorage.removeItem("dynamicPoints")
      ]);
      
      clearAuthData();
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
        setAuthData,
        clearAuthData,
        setMyDynamicPoints,
        isAuthenticated,
        login,
        logout,
        isLoading,
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