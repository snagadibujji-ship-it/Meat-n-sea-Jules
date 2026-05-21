import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudioHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MnS Studio</Text>
      <Text style={styles.subtitle}>Premium, curated, and exclusive seafood.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#CC0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD400',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold'
  }
});
