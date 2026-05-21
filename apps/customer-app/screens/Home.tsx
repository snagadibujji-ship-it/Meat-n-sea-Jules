import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSearch } from 'shared';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Fixed coordinates for demo purposes (e.g., somewhere in India)
  const userLat = '17.3850';
  const userLng = '78.4867';

  // 300ms Debounce implementation
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  const { data, isLoading, error } = useSearch(debouncedQuery, userLat, userLng);

  const renderVendor = ({ item }: { item: any }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultName}>{item.name}</Text>
      {item.description && <Text style={styles.resultDesc}>{item.description}</Text>}
      <Text style={styles.resultMeta}>
        Store • {(item.distance / 1000).toFixed(1)} km away
        {item.isOpen ? ' • Open' : ' • Closed'}
      </Text>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultName}>{item.name}</Text>
      {item.category && <Text style={styles.resultCategory}>{item.category}</Text>}
      <Text style={styles.resultMeta}>
        Product • ₹{(item.pricePaise / 100).toFixed(2)}
        {item.distance && ` • ${(item.distance / 1000).toFixed(1)} km away`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meat n Sea</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for fish, chicken, or stores..."
          placeholderTextColor="#6b7280"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        {isLoading && <Text style={styles.loadingText}>Searching...</Text>}
      </View>

      {debouncedQuery.length > 0 && data && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={[
              ...(data.vendors || []).map((v: any) => ({ ...v, type: 'vendor' })),
              ...(data.products || []).map((p: any) => ({ ...p, type: 'product' }))
            ]}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) =>
              item.type === 'vendor' ? renderVendor({ item }) : renderProduct({ item })
            }
            ListEmptyComponent={
              !isLoading ? <Text style={styles.emptyText}>No results found nearby.</Text> : null
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#1E6FBF', // Brand Blue
    borderBottomWidth: 4,
    borderBottomColor: '#FFD400', // Brand Yellow
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#171f33',
  },
  searchInput: {
    backgroundColor: '#0A0F1D',
    color: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  loadingText: {
    color: '#FFD400',
    marginTop: 8,
    fontSize: 12,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#171f33',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#CC0000', // Brand Red accent
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultDesc: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  resultCategory: {
    fontSize: 12,
    color: '#FFD400',
    marginTop: 4,
    fontWeight: 'bold',
  },
  resultMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
});
