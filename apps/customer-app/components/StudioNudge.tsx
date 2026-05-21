import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useAppStore, useLogEvent } from 'shared';

export default function StudioNudge() {
  const { bazaarOrderCount, setMode } = useAppStore();
  const logEvent = useLogEvent();
  const [isVisible, setIsVisible] = React.useState(bazaarOrderCount === 3);

  const handleSwitch = () => {
    setIsVisible(false);
    setMode('studio');
    logEvent.mutate({
        eventName: 'nudge_accepted',
        metaData: { fromMode: 'bazaar', toMode: 'studio' }
    });
  };

  const handleDismiss = () => {
    setIsVisible(false);
    logEvent.mutate({
        eventName: 'nudge_dismissed',
        metaData: { fromMode: 'bazaar' }
    });
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>✦</Text>
          <Text style={styles.title}>You've been invited.</Text>
          <Text style={styles.desc}>
            Experience premium curation for your next dinner. Try MnS Studio and enjoy export-quality seafood with priority 30-minute delivery.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSwitch}>
            <Text style={styles.primaryBtnText}>ENTER STUDIO (10% OFF)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleDismiss}>
            <Text style={styles.secondaryBtnText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0A0F1D',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CC0000',
    width: '100%',
    maxWidth: 400,
  },
  icon: {
    fontSize: 48,
    color: '#FFD400',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: '#CC0000',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryBtn: {
    padding: 16,
  },
  secondaryBtnText: {
    color: '#9ca3af',
    fontWeight: 'bold',
  }
});
