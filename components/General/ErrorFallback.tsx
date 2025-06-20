// src/components/ErrorFallback.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

const ErrorFallback: React.FC<Props> = ({
  title = "Server Not Reachable",
  message = "We’re unable to connect to the server right now. Please check your internet or try again later.",
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={64} color="#ccc" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorFallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 15,
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginTop: 10,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
