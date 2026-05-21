import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import { useSearch, useAppStore } from 'shared';
import ModeSwitcher from '../components/ModeSwitcher';
import BazaarHome from './BazaarHome';
import StudioSubscriptions from './StudioSubscriptions';
import StudioNudge from '../components/StudioNudge';

export default function Home() {
  const { mode } = useAppStore();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Fixed coordinates for demo purposes
  const userLat = '17.3850';
  const userLng = '78.4867';

  // 300ms Debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  const { data, isLoading } = useSearch(debouncedQuery, userLat, userLng);

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

  // Dynamic Styles based on Mode using the new tokens
  const isBazaar = mode === 'bazaar';
  const headerBgColor = isBazaar ? '#003366' : '#0a0a0a';
  const pageBgColor = isBazaar ? '#f7f9fd' : '#131313';

  return (
    <View style={[styles.container, { backgroundColor: pageBgColor }]}>
      <View style={[styles.header, { backgroundColor: headerBgColor }]}>
        <ModeSwitcher />
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, isBazaar ? styles.searchInputBazaar : styles.searchInputStudio]}
            placeholder="Search for fish, chicken, or stores..."
            placeholderTextColor={isBazaar ? "#737780" : "#99907c"}
            value={searchInput}
            onChangeText={setSearchInput}
          />
          {isLoading && <Text style={styles.loadingText}>Searching...</Text>}
        </View>
      </View>

      {debouncedQuery.length > 0 && data ? (
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
      ) : (
        <View style={styles.contentContainer}>
           {isBazaar ? <BazaarHome /> : <StudioSubscriptions />}
        </View>
      )}

      <StudioNudge />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  searchContainer: {
    marginTop: 12,
  },
  searchInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  searchInputBazaar: {
    backgroundColor: '#ffffff',
    color: '#191c1f',
    borderColor: '#EBEBEB',
  },
  searchInputStudio: {
    backgroundColor: '#1c1b1b',
    color: '#e5e2e1',
    borderColor: '#353534',
  },
  loadingText: {
    color: '#d4af37',
    marginTop: 8,
    fontSize: 12,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: '#171f33',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
  },
  resultName: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  resultDesc: { fontSize: 14, color: '#9ca3af', marginTop: 4 },
  resultCategory: { fontSize: 12, color: '#d4af37', marginTop: 4, fontWeight: 'bold' },
  resultMeta: { fontSize: 12, color: '#6b7280', marginTop: 8 },
  emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 32, fontSize: 16 },
});
