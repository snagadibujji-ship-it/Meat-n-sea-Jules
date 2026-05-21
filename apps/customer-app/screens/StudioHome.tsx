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
        <ActivityIndicator size="large" color="#d4af37" />
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

// Stitch Theme: Abyssal Gold (Studio Mode)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313', // surface background
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24, // gutter-desktop equiv
    paddingBottom: 80, // section-gap-desktop
  },
  errorText: {
    color: '#ffb4ab', // error color
    fontSize: 16,
  },
  heroSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32, // headline-lg
    fontWeight: '700',
    color: '#d4af37', // primary
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#d0c5af', // on-surface-variant
    fontWeight: '400',
    textAlign: 'center',
  },
  collectionSection: {
    marginBottom: 40,
  },
  collectionHeader: {
    marginBottom: 20,
  },
  collectionTitle: {
    fontSize: 24, // headline-md
    fontWeight: '600',
    color: '#e5e2e1', // on-surface
    letterSpacing: 0,
  },
  collectionSubtitle: {
    fontSize: 14,
    color: '#d4af37', // primary
    marginTop: 4,
  },
  productList: {
    paddingRight: 24,
  }
});
