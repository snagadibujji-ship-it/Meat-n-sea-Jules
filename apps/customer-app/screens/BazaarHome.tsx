import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BazaarHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Bazaar!</Text>
      <Text style={styles.subtitle}>Discover local vendors and fresh catch.</Text>
    </View>
  );
}

// Stitch Theme: Oceanic Premium Commerce (Light Mode)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f9fd', // base background
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'sans-serif', // Assuming Plus Jakarta Sans isn't loaded
    fontSize: 28, // headline-md
    fontWeight: '700',
    color: '#003366', // Primary Deep Ocean Blue
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569', // text-muted
  }
});
