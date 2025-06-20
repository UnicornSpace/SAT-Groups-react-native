//@ts-nocheck
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Linking,
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Searchbar, TextInput } from "react-native-paper";
import { size } from "react-native-responsive-sizes";
import { theme } from "@/infrastructure/themes";
import { getAllBranchList } from "@/api/all-branches";
import { useAuth } from "@/utils/auth-context";
import { openInGoogleMaps } from "@/components/branches/helpers/location-helper";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [branchList, setbranchList] = React.useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // API Call
  const { driverId, token } = useAuth();
  useEffect(() => {
    const branchFetch = async () => {
      try {
        const response = await getAllBranchList(driverId, token);
        setbranchList(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    branchFetch();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const filteredResults = branchList.filter(
          (item) =>
            item.location_name.toLowerCase().includes(query.toLowerCase()) ||
            item.location_code.toLowerCase().includes(query.toLowerCase()) ||
            item.brand.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults); 
        setIsSearching(false);
      }, 800);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const renderSearchItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => Linking.openURL(item.google_map_link)}
      style={styles.searchItem}
    >
      <View style={styles.searchItemIcon}>
        <Ionicons
          name="business" // Using business icon for all branches
          size={20}
          color="#666"
        />
      </View>
      <View style={styles.searchItemContent}>
        <Text style={styles.searchItemTitle}>{item.location_name}</Text>
        <Text style={styles.badge}>
            {item.location_code}
          </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#999" />
    </TouchableOpacity>
  );

  const renderSuggestion = (item: any, index: any) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionItem}
      onPress={() => handleSearch(item)}
    >
      <Ionicons name="search" size={16} color="#666" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Searchbar
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          placeholder="Search branches..."
          placeholderTextColor="#999"
          onChangeText={handleSearch}
          value={searchQuery}
          clearIcon="close"
          autoFocus={true}
          iconColor="#999"
        />
      </View>

      {/* Search Content */}
      <View style={styles.content}>
        {searchQuery.length === 0 ? (
          // Show suggestions when no search query
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionSection}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {branchList.map((item, index) =>
                renderSuggestion(item.location_name, index)
              )}
            </View>

            {/* <View style={styles.suggestionSection}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.popularGrid}>
                {branchList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularTag}
                    onPress={() => handleSearch(item)}
                  >
                    <Text style={styles.popularTagText}>
                      {item.location_code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
          </View>
        ) : (
          // Show search results
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="refresh" size={24} color="#666" />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchItem}
                keyExtractor={(item) => item.google_map_link.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsList}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="#ccc" />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for branches, ATMs, or services
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    paddingTop: hp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    // paddingVertical: hp(1),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: wp(3),
    padding: wp(2),
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 100,
    elevation: 0,
    borderWidth: 0.2,
  },
  searchInput: {
    fontSize: size(14),
    color: "#333",
    fontFamily: theme.fontFamily.regular,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  suggestionsContainer: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  suggestionSection: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamily.semiBold,
    color: "#333",
    marginBottom: hp(1),
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 15,
    color: "#666",
    marginLeft: wp(3),
    fontFamily: theme.fontFamily.regular,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },
  popularTag: {
    backgroundColor: "#677D98",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 20,
    marginBottom: hp(0.8),
  },
  popularTagText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: theme.fontFamily.semiBold,
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: hp(1),
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  resultsList: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchItemIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  searchItemContent: {
    flex: 1,
    flexDirection: "column",
    
  },
  searchItemTitle: {
    fontSize: 16,
    fontFamily: theme.fontFamily.semiBold,
    color: "#333",
    marginBottom: hp(0.5),
  },
  searchItemSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: theme.fontFamily.light,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },
  noResultsText: {
    fontSize: 20,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.brand.blue,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  noResultsSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: theme.fontFamily.light,
  },
  badge: {
    backgroundColor: theme.colors.brand.blue,
    borderRadius: 20,
    width: wp(20),
    color: "#fff",
    textAlign: "center",
    fontSize: size(10),
    paddingVertical: hp(0.5),
  },
});
