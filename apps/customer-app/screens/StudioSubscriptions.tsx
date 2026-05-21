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
        <ActivityIndicator size="large" color="#FFD400" />
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
                <Text style={styles.activeSubText}>Status: <Text style={{ color: '#22c55e', textTransform: 'uppercase' }}>{sub.status}</Text></Text>
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
    backgroundColor: '#CC0000', // Studio Deep Red
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD400',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: 1,
  },
  mySubsSection: {
    marginBottom: 32,
  },
  activeSubCard: {
    backgroundColor: '#1E6FBF20',
    borderWidth: 1,
    borderColor: '#1E6FBF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  activeSubTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  activeSubText: {
    color: '#d1d5db',
    marginBottom: 4,
  }
});
