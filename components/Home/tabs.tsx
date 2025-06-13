// // TabsComponent.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
// import TransactionCard from '@/components/Home/transcation-card';
// import { theme } from '@/infrastructure/themes';
// import axiosInstance from '@/utils/axionsInstance';
// import { width } from 'react-native-responsive-sizes';
// import { useAuth } from '@/utils/AuthContext';
// import { t } from 'i18next';

// // Define the transaction type
// interface Transaction {
//   points: string;
//   type: string; // "Received" or "Redeemed"
//   referred_date: string;
//   // Add any other fields from your API response
// }

// export default function TabsComponent() {
//   const [activeTab, setActiveTab] = useState('Received');
//   const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const {token, driverId} = useAuth()
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         setLoading(true);
        
//         const driver_id = driverId;
//         const usertoken = token;

//         const response = await axiosInstance.post(
//           "/driver-points.php",
//           { 
//             driver_id,  
//             take: 10,
//             skip: 0 
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${usertoken}`,
//             },
//           }
//         );

//         console.log("API Response:", response.data);
        
//         if (response.data.status === "success") {
//           setTransactionsData(response.data.transactions || []);
//           setTotalPoints(response.data.total_points || 0);
//         } else {
//           console.error("API returned error:", response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   // Filter transactions based on active tab
//   const getFilteredTransactions = () => {
//     if (!transactionsData || transactionsData.length === 0) {
//       return [];
//     }

//     switch (activeTab) {
//       case 'Received':
//         return transactionsData.filter(transaction => 
//           transaction.type === 'Received');
//       case 'Spent':
//         return transactionsData.filter(transaction => 
//           transaction.type === 'Redeemed' || parseFloat(transaction.points) < 0);
//       case 'All':
//         return transactionsData;
//       default:
//         return [];
//     }
//   };

//   const renderItem = ({ item }: { item: Transaction }) => {
//     // Format the date from "YYYY-MM-DD" to a more readable format
//     const formatDate = (dateString: string) => {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { 
//         day: 'numeric', 
//         month: 'long'
//       });
//     };

//     // Determine if it's a positive or negative transaction
//     const isPositive = parseFloat(item.points) >= 0;
//     const pointsDisplay = isPositive ? `+${item.points}` : item.points;

//     return (
//       <TransactionCard
//         companyName="Nox Solution" // You might want to replace this with actual data
//         location="Perundurai" // You might want to replace this with actual data
//         date={formatDate(item.referred_date)}
//         points={pointsDisplay}
//         transactionType={item.type}
//       />
//     );
//   };

//   const renderEmptyList = () => (
//     <View style={styles.emptyContainer}>
//       <Text style={styles.emptyText}>No transactions found</Text>
//     </View>
//   );

//   const filteredTransactions = getFilteredTransactions();

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabsList}>
//         <TouchableOpacity
//           style={[
//             styles.tabsTrigger,
//             activeTab === 'Received' && styles.activeTabsTrigger,
//           ]}
//           onPress={() => setActiveTab('Received')}
//         >
//           <Text
//             style={[
//               styles.tabsTriggerText,
//               activeTab === 'Received' && styles.activeTabsTriggerText,
//             ]}
//           >
//             {t("Received")}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.tabsTrigger,
//             activeTab === 'Spent' && styles.activeTabsTrigger,
//           ]}
//           onPress={() => setActiveTab('Spent')}
//         >
//           <Text
          
//             style={[
//               styles.tabsTriggerText,
//               activeTab === 'Spent' && styles.activeTabsTriggerText,
//             ]}
//           >
//             {t("Spent")}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.tabsTrigger,
//             activeTab === 'All' && styles.activeTabsTrigger,
//           ]}
//           onPress={() => setActiveTab('All')}
//         >
//           <Text
//             style={[
//               styles.tabsTriggerText,
//               activeTab === 'All' && styles.activeTabsTriggerText,
//             ]}
//           >
//             {t("ALL")}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.transactionsContainer}>
//         {loading ? (
//           <Text style={styles.loadingText}>Loading transactions...</Text>
//         ) : (
//           <FlatList
//           nestedScrollEnabled={true}
//           keyboardShouldPersistTaps="handled"
//             data={filteredTransactions}
//             renderItem={renderItem}
//             keyExtractor={(item, index) => `transaction-${index}`}
//             contentContainerStyle={styles.listContainer}
//             ListEmptyComponent={renderEmptyList}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//           />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: width(90),
//     alignItems: 'center',
//   },
//   tabsList: {
//     flexDirection: 'row',
//     gap: 4,
//     backgroundColor: theme.colors.text.primary,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 9999,
//     padding: 3,
//     marginBottom: 10,
//   },
//   tabsTrigger: {
//     paddingVertical: 5,
//     paddingHorizontal: width(9),
//     borderRadius: 9999,
//   },
//   activeTabsTrigger: {
//     backgroundColor: "#36629A",
//     shadowOpacity: 0,
//   },
//   tabsTriggerText: {
//     fontSize: 12,
//     color: '#666',
//     fontFamily: theme.fontFamily.regular,
//   },
//   activeTabsTriggerText: {
//     color: '#fff',
//   },
//   transactionsContainer: {
//     width: '100%',
//     paddingHorizontal: 10,
//   },
//   listContainer: {
//     paddingVertical: 10,
//   },
//   separator: {
//     height: 10,
//   },
//   emptyContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: theme.colors.text.secondary,
//     fontFamily: theme.fontFamily.regular,
//     fontSize: 14,
//   },
//   loadingText: {
//     color: theme.colors.text.secondary,
//     fontFamily: theme.fontFamily.regular,
//     fontSize: 14,
//     padding: 20,
//   },
// });


// TabsComponent.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import TransactionCard from '@/components/Home/transcation-card';
import { theme } from '@/infrastructure/themes';
import axiosInstance from '@/utils/axionsInstance';
import { width } from 'react-native-responsive-sizes';
import { useAuth } from '@/utils/AuthContext';
import { t } from 'i18next';

// Define the transaction type
interface Transaction {
  points: string;
  type: string; // "Received" or "Redeemed"
  referred_date: string;
  // Add any other fields from your API response
}

export default function TabsComponent() {
  const [activeTab, setActiveTab] = useState('Received');
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const {token, driverId} = useAuth();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        const driver_id = driverId;
        const usertoken = token;

        const response = await axiosInstance.post(
          "/driver-points.php",
          { 
            driver_id,  
            take: 10,
            skip: 0 
          },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );

        // console.log("API Response:", response.data);
        
        if (response.data.status === "success") {
          setTransactionsData(response.data.transactions || []);
          setTotalPoints(response.data.total_points || 0);
        } else {
          console.error("API returned error:", response.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (!transactionsData || transactionsData.length === 0) {
      return [];
    }

    switch (activeTab) {
      case 'Received':
        return transactionsData.filter(transaction => 
          transaction.type === 'Received');
      case 'Spent':
        return transactionsData.filter(transaction => 
          transaction.type === 'Redeemed' || parseFloat(transaction.points) < 0);
      case 'All':
        return transactionsData;
      default:
        return [];
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    // Format the date from "YYYY-MM-DD" to a more readable format
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long'
      });
    };

    // Determine if it's a positive or negative transaction
    const isPositive = parseFloat(item.points) >= 0;
    const pointsDisplay = isPositive ? `+${item.points}` : item.points;

    return (
      <TransactionCard
        companyName="Nox Solution" // You might want to replace this with actual data
        location="Perundurai" // You might want to replace this with actual data
        date={formatDate(item.referred_date)}
        points={pointsDisplay}
        transactionType={item.type}
      />
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No transactions found</Text>
    </View>
  );

  const filteredTransactions = getFilteredTransactions();
  const deviceWidth = Dimensions.get('window').width;
  const tabWidth = (deviceWidth * 0.9 - 16) / 3; // Calculate based on container width, accounting for padding and gaps

  return (
    <View style={styles.container}>
      <View style={styles.tabsList}>
        <TouchableOpacity
          style={[
            styles.tabsTrigger,
            { width: tabWidth },
            activeTab === 'Received' && styles.activeTabsTrigger,
          ]}
          onPress={() => setActiveTab('Received')}
        >
          <Text
            style={[
              styles.tabsTriggerText,
              activeTab === 'Received' && styles.activeTabsTriggerText,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {t("Received")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabsTrigger,
            { width: tabWidth },
            activeTab === 'Spent' && styles.activeTabsTrigger,
          ]}
          onPress={() => setActiveTab('Spent')}
        >
          <Text
            style={[
              styles.tabsTriggerText,
              activeTab === 'Spent' && styles.activeTabsTriggerText,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {t("Spent")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabsTrigger,
            { width: tabWidth },
            activeTab === 'All' && styles.activeTabsTrigger,
          ]}
          onPress={() => setActiveTab('All')}
        >
          <Text
            style={[
              styles.tabsTriggerText,
              activeTab === 'All' && styles.activeTabsTriggerText,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {t("ALL")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading transactions...</Text>
        ) : (
          <FlatList
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            data={filteredTransactions}
            renderItem={renderItem}
            keyExtractor={(item, index) => `transaction-${index}`}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width(90),
    alignItems: 'center',
  },
  tabsList: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 9999,
    padding: 3,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  tabsTrigger: {
    paddingVertical: 5,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabsTrigger: {
    backgroundColor: "#36629A",
    shadowOpacity: 0,
  },
  tabsTriggerText: {
    fontSize: 12,
    color: '#666',
    fontFamily: theme.fontFamily.regular,
    textAlign: 'center',
  },
  activeTabsTriggerText: {
    color: '#fff',
  },
  transactionsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: 14,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: 14,
    padding: 20,
  },
});