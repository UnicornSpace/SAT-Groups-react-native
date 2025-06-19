import React, { useEffect } from "react";
import { useAuth } from "@/utils/auth-context";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A wrapper component to protect routes that require authentication
 * Redirects to language selection screen if not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/(screens)/LanguageSeletionScreen");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;