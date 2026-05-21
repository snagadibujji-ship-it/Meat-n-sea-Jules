import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useStudioPlans, useCreateSubscription, useMySubscriptions } from 'shared';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';

export default function StudioSubscriptions() {
  const { data: plans, isLoading: plansLoading } = useStudioPlans();
  const { data: mySubs, isLoading: subsLoading } = useMySubscriptions();
  const createSub = useCreateSubscription();

  const handleSubscribe = async (planId: string) => {
    try {
      await createSub.mutateAsync({
        planId,
        deliveryDay: 'wednesday', // Default demo day
        deliveryAddress: {
          street: '123 Test St',
          coordinates: [78.4867, 17.3850],
        },
        nextDeliveryAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      });
      Alert.alert('Success!', 'Your Studio Subscription is now active.');
    } catch (e) {
      Alert.alert('Error', 'Failed to subscribe');
    }
  };

  if (plansLoading || subsLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <View style={styles.header}>
        <Text style={styles.title}>Studio Presets</Text>
        <Text style={styles.subtitle}>Curated boxes delivered automatically.</Text>
      </View>

      {/* Active Subscriptions */}
      {mySubs && mySubs.length > 0 && (
        <View style={styles.mySubsSection}>
          <Text style={styles.sectionTitle}>My Active Boxes</Text>
          {mySubs.map((sub: any) => (
             <View key={sub._id} style={styles.activeSubCard}>
                <Text style={styles.activeSubTitle}>{sub.planId?.name}</Text>
                <Text style={styles.activeSubText}>Status: <Text style={{ color: '#00ffff', textTransform: 'uppercase' }}>{sub.status}</Text></Text>
                <Text style={styles.activeSubText}>Next Delivery: {new Date(sub.nextDeliveryAt).toLocaleDateString()}</Text>
             </View>
          ))}
        </View>
      )}

      {/* Available Plans */}
      <Text style={styles.sectionTitle}>Available Curations</Text>
      {plans?.map((plan: any) => (
        <SubscriptionPlanCard
            key={plan._id}
            plan={plan}
            onSubscribe={() => handleSubscribe(plan._id)}
        />
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313', // Deep Matte Black (Studio mode)
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24, // margin-desktop scale
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32, // headline-lg
    fontWeight: '700',
    color: '#d4af37', // Gold
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d0c5af',
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 20, // title-sm
    fontWeight: '700',
    color: '#e5e2e1', // on-surface
    marginBottom: 20,
    letterSpacing: 0,
  },
  mySubsSection: {
    marginBottom: 40, // section-gap
  },
  activeSubCard: {
    backgroundColor: 'rgba(0, 71, 171, 0.1)', // Ocean blue tint
    borderWidth: 1,
    borderColor: '#0047ab',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  activeSubTitle: {
    color: '#e5e2e1',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  activeSubText: {
    color: '#d0c5af',
    marginBottom: 4,
    fontSize: 14,
  }
});
