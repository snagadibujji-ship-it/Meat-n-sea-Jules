import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  catchTime: string; // ISO String
}

export default function FreshnessCountdown({ catchTime }: Props) {
  const [hoursElapsed, setHoursElapsed] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      if (!catchTime) return;
      const catchDate = new Date(catchTime).getTime();
      const now = new Date().getTime();
      const diffMs = now - catchDate;
      setHoursElapsed(Math.floor(diffMs / (1000 * 60 * 60)));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [catchTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.clockIcon}>⏱️</Text>
      <View style={styles.textContainer}>
          <Text style={styles.label}>GUARANTEED FRESHNESS</Text>
          <Text style={styles.value}>Sourced {hoursElapsed} hours ago from Uppada Harbour</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171f33',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD400',
    marginBottom: 24,
  },
  clockIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  }
});
