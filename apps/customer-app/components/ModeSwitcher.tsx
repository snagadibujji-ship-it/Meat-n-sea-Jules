import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from 'shared';

export default function ModeSwitcher() {
  const { mode, setMode, inStudioGeofence } = useAppStore();

  if (!inStudioGeofence) {
      return (
          <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>✦ Studio coming soon to your area</Text>
          </View>
      );
  }

  return (
    <View style={[styles.container, mode === 'bazaar' ? styles.containerBazaar : styles.containerStudio]}>
      <TouchableOpacity
        style={[styles.pill, mode === 'bazaar' ? styles.activeBazaar : styles.inactive]}
        onPress={() => setMode('bazaar')}
      >
        <Text style={[styles.text, mode === 'bazaar' ? styles.textActiveBazaar : styles.textInactiveBazaar]}>
            🐟 Bazaar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.pill, mode === 'studio' ? styles.activeStudio : styles.inactive]}
        onPress={() => setMode('studio')}
      >
        <Text style={[styles.text, mode === 'studio' ? styles.textActiveStudio : styles.textInactiveStudio]}>
            ✦ MnS Studio
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  comingSoonContainer: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  comingSoonText: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 12,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 999, // Pill shape
    padding: 4,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 1,
  },
  containerBazaar: {
    backgroundColor: '#F4F6FA', // Ice Gray
    borderColor: '#EBEBEB',
  },
  containerStudio: {
    backgroundColor: '#1c1b1b', // surface-low
    borderColor: '#353534',
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  activeBazaar: {
    backgroundColor: '#003366', // Deep Ocean Blue
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  activeStudio: {
    backgroundColor: '#d4af37', // Luxury Gold
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  inactive: {
    backgroundColor: 'transparent',
  },
  text: {
    fontWeight: '700', // headline-md
    fontSize: 14,
    letterSpacing: 0.5,
  },
  textActiveBazaar: {
    color: '#ffffff', // Pristine Clean White
  },
  textActiveStudio: {
    color: '#0a0a0a', // Matte Black
  },
  textInactiveBazaar: {
    color: '#475569', // text-muted
  },
  textInactiveStudio: {
    color: '#d0c5af', // on-surface-variant
  }
});
