import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useAppStore, useLogEvent } from 'shared';

const { width, height } = Dimensions.get('window');

export default function ModeSelection() {
  const { setMode, setHasSeenOnboarding } = useAppStore();
  const logEvent = useLogEvent();

  const handleSelect = (selectedMode: 'bazaar' | 'studio') => {
    setMode(selectedMode);
    setHasSeenOnboarding(true);

    // Log the onboarding selection
    logEvent.mutate({
        eventName: 'onboarding_mode_selected',
        metaData: { mode: selectedMode }
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Pane: Sabka Bazaar */}
      <TouchableOpacity
        style={[styles.pane, styles.bazaarPane]}
        onPress={() => handleSelect('bazaar')}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
            <Text style={styles.bazaarTitle}>🐟 Sabka Bazaar</Text>
            <Text style={styles.bazaarDesc}>
                All local market vendors. Competitive pricing. Discover fresh daily catch options from your neighborhood.
            </Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Everyday Value</Text>
            </View>
        </View>
      </TouchableOpacity>

      {/* Bottom Pane: MnS Studio */}
      <TouchableOpacity
        style={[styles.pane, styles.studioPane]}
        onPress={() => handleSelect('studio')}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
            <Text style={styles.studioTitle}>✦ MnS Studio</Text>
            <Text style={styles.studioDesc}>
                Premium curated flagship experience. 30-minute priority delivery. Guaranteed export-quality packaging.
            </Text>
            <View style={[styles.badge, styles.studioBadge]}>
                <Text style={styles.studioBadgeText}>Premium Experience</Text>
            </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  pane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  bazaarPane: {
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 4,
    borderBottomColor: '#F97316',
  },
  studioPane: {
    backgroundColor: '#CC0000',
  },
  bazaarTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F97316',
    marginBottom: 16,
    textAlign: 'center',
  },
  bazaarDesc: {
    fontSize: 16,
    color: '#431407',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  studioTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD400',
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  studioDesc: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9731620',
  },
  badgeText: {
    color: '#F97316',
    fontWeight: 'bold',
  },
  studioBadge: {
    backgroundColor: '#FFD40020',
    borderColor: '#FFD400',
    borderWidth: 1,
  },
  studioBadgeText: {
    color: '#FFD400',
    fontWeight: 'bold',
  }
});
