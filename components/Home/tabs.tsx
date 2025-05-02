import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TranscationCard from '@/components/Home/transcation-card';
import { theme } from '@/infrastructure/themes';
export default function TabsComponent() {
  const [activeTab, setActiveTab] = useState('Received');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Received':
        return (
          <View style={styles.tabContent}>
            <TranscationCard />
            {/* <Text style={styles.tabContentText}>Content for Tab 1</Text> */}
          </View>
        );
      case 'Spent':
        return (
          <View style={styles.tabContent}>
            <TranscationCard />
            {/* <Text style={styles.tabContentText}>Content for Tab 2</Text> */}
          </View>
        );
      case 'All':
        return (
          <View style={styles.tabContent}>
            <TranscationCard />
            {/* <Text style={styles.tabContentText}>Content for Tab 3</Text> */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsList}>
        <TouchableOpacity
          style={[
            styles.tabsTrigger,
            activeTab === 'Received' && styles.activeTabsTrigger,
          ]}
          onPress={() => setActiveTab('Received')}
        >
          <Text
            style={[
              styles.tabsTriggerText,
              activeTab === 'Received' && styles.activeTabsTriggerText,
            ]}
          >
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabsTrigger,
            activeTab === 'Spent' && styles.activeTabsTrigger,
          ]}
          onPress={() => setActiveTab('Spent')}
        >
          <Text
            style={[
              styles.tabsTriggerText,
              activeTab === 'Spent' && styles.activeTabsTriggerText,
            ]}
          >
            Spent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabsTrigger,
            activeTab === 'All' && styles.activeTabsTrigger,
          ]}
          onPress={() => setActiveTab('All')}
        >
          <Text
            style={[
              styles.tabsTriggerText,
              activeTab === 'All' && styles.activeTabsTriggerText,
            ]}
          >
            ALL
          </Text>
        </TouchableOpacity>
      </View>
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  tabsList: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: '#E0E0E0', // border color
    borderRadius: 9999, // rounded-full
    padding: 3, // p-1
  },
  tabsTrigger: {
    paddingVertical: 5                                             ,
    paddingHorizontal: 30,
    borderRadius: 9999, // rounded-full
  },
  activeTabsTrigger: {
    backgroundColor: "#36629A", // primary color, adjust to match your theme
    shadowOpacity: 0, // shadow-none
  },
  tabsTriggerText: {
    fontSize: 14,
    color: '#666', // default text color
    fontFamily: theme.fontFamily.regular,
  },
  activeTabsTriggerText: {
    color: '#fff', // primary-foreground color
  },
  tabContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabContentText: {
    fontSize: 12,
    color: '#666', // muted-foreground color
    textAlign: 'center',
  },
});