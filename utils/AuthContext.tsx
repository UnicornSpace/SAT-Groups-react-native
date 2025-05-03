import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  driverId: number | null;
  setAuthData: (token: string, driverId: number) => void;
  clearAuthData: () => void;
  setMyDynamicPoints: (points: number) => void;
  myDynamicPoints: number | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [myDynamicPoints, setMyDynamicPointsState] = useState<number | null>(null);

  const setAuthData = (token: string, driverId: number) => {
    setToken(token);
    setDriverId(driverId);
  };

  const clearAuthData = () => {
    setToken(null);
    setDriverId(null);
    setMyDynamicPointsState(null);
  };

  const setMyDynamicPoints = (points: number) => {
    setMyDynamicPointsState(points);
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
