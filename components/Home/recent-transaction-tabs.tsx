import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import TransactionCard from "@/components/home/transcation-card";
import { theme } from "@/infrastructure/themes";
import { width } from "react-native-responsive-sizes";
import { t } from "i18next";
import { SkeletonLoader } from "../skeleton/home/home-skeleton";
import Title from "../general/title";
import { Transaction } from "@/types/index.type";

export default function RecentTransactionTabs({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState("Received");

  const getFilteredTransactions = () => {
    if (!transactions || transactions.length === 0) return [];

    switch (activeTab) {
      case "Received":
        return transactions.filter((tx) => tx.type === "Received");
      case "Spent":
        return transactions.filter(
          (tx) => tx.type === "Redeemed" || parseFloat(tx.points) < 0
        );
      case "All":
        return transactions;
      default:
        return [];
    }
  };

  const EachTransactionCard = ({ item }: { item: Transaction }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      });
    };

    const isPositive = parseFloat(item.points) >= 0;
    const pointsDisplay = isPositive ? `+${item.points}` : item.points;

    return (
      <TransactionCard
        companyName={item.branch}
        date={formatDate(item.referred_date)}
        points={pointsDisplay}
        transactionType={item.type}
        logo={item.logo}
      />
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No transactions found</Text>
    </View>
  );

  const filteredTransactions = getFilteredTransactions();
  const deviceWidth = Dimensions.get("window").width;
  const tabWidth = (deviceWidth * 0.9 - 16) / 3;

  return (
    <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
      <Title>{t("Recent_Transcation")}</Title>
      <View style={styles.container}>
        <View style={styles.tabsList}>
          {["Received", "Spent", "All"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabsTrigger,
                { width: tabWidth },
                activeTab === tab && styles.activeTabsTrigger,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabsTriggerText,
                  activeTab === tab && styles.activeTabsTriggerText,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          keyboardShouldPersistTaps="handled"
          data={loading ? [] : filteredTransactions}
          renderItem={EachTransactionCard}
          keyExtractor={(item, index) => `transaction-${index}`}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            loading ? (
              <View style={{ width: width(90), gap: 15, marginTop: 10 }}>
                <SkeletonLoader width="100%" height={70} />
                <SkeletonLoader width="100%" height={70} />
                <SkeletonLoader width="100%" height={70} />
              </View>
            ) : (
              renderEmptyList()
            )
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width(90),
    alignItems: "center",
  },
  tabsList: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 9999,
    padding: 3,
    marginBottom: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  tabsTrigger: {
    paddingVertical: 5,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabsTrigger: {
    backgroundColor: "#36629A",
    shadowOpacity: 0,
  },
  tabsTriggerText: {
    fontSize: 12,
    color: "#666",
    fontFamily: theme.fontFamily.regular,
    textAlign: "center",
  },
  activeTabsTriggerText: {
    color: "#fff",
  },
  listContainer: {
    paddingVertical: 10,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: 14,
  },
});
