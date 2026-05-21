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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#431407',
  }
});
