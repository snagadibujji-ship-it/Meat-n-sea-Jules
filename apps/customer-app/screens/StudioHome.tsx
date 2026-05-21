import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useStudioHome } from 'shared';
import FreshnessCountdown from '../components/FreshnessCountdown';
import StudioProductCard from '../components/StudioProductCard';

export default function StudioHome() {
  const { data, isLoading, error } = useStudioHome();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFD400" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load Studio content.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* Freshness Clock */}
      {data?.freshness && (
        <FreshnessCountdown catchTime={data.freshness.catchTime} />
      )}

      {/* Hero Header */}
      <View style={styles.heroSection}>
        <Text style={styles.title}>MnS Studio</Text>
        <Text style={styles.subtitle}>Premium, curated, and exclusive seafood.</Text>
      </View>

      {/* Collections */}
      {data?.collections?.map((collection: any) => (
        <View key={collection._id} style={styles.collectionSection}>
          <View style={styles.collectionHeader}>
            <Text style={styles.collectionTitle}>{collection.title}</Text>
            {collection.subtitle && (
              <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
            )}
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={collection.products}
            keyExtractor={(p) => p._id.toString()}
            renderItem={({ item }) => <StudioProductCard product={item} />}
            contentContainerStyle={styles.productList}
          />
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC0000', // Deep Red background
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
  },
  heroSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD400',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  collectionSection: {
    marginBottom: 40,
  },
  collectionHeader: {
    marginBottom: 16,
  },
  collectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  collectionSubtitle: {
    fontSize: 14,
    color: '#FFD400',
    marginTop: 4,
  },
  productList: {
    paddingRight: 24, // allows scrolling past the last item comfortably
  }
});
