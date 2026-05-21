import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  plan: any;
  onSubscribe: () => void;
}

export default function SubscriptionPlanCard({ plan, onSubscribe }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{plan.name}</Text>
      <Text style={styles.price}>₹{(plan.pricePaise / 100).toFixed(2)} / {plan.intervalDays} Days</Text>
      <Text style={styles.description}>{plan.description}</Text>

      <View style={styles.itemsContainer}>
        {plan.curatedItems?.map((item: string, idx: number) => (
          <Text key={idx} style={styles.itemText}>✦ {item}</Text>
        ))}
      </View>

      <TouchableOpacity style={styles.subscribeBtn} onPress={onSubscribe}>
        <Text style={styles.subscribeBtnText}>SUBSCRIBE NOW</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stitch Theme: Abyssal Gold (Studio Mode)
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1b1b',
    borderRadius: 24, // rounded-xl for promotional banners
    padding: 24,
    marginBottom: 24, // section-gap
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)', // 15-20% opacity gold border
    shadowColor: '#0047ab', // Ocean Blue tint shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    color: '#d4af37', // Luxury Gold
    fontSize: 28, // headline-lg-mobile
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  price: {
    color: '#ffffff',
    fontSize: 20, // title-sm equivalent
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    color: '#d0c5af', // on-surface-variant
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 22,
  },
  itemsContainer: {
    marginBottom: 32,
    backgroundColor: '#0e0e0e',
    padding: 16,
    borderRadius: 12,
  },
  itemText: {
    color: '#e5e2e1',
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  subscribeBtn: {
    backgroundColor: '#d4af37', // Gold Gradient fallback
    paddingVertical: 16,
    borderRadius: 999, // Pill-shaped
    alignItems: 'center',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeBtnText: {
    color: '#0a0a0a', // Deep Matte Black
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});
