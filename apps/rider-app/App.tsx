import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import DispatchOfferModal from './screens/DispatchOffer';
import DeliveryProof from './screens/DeliveryProof';

// Note: Using a mock order here just for integration testing purposes.
const mockOrder = {
  id: '123',
  customerId: 'cust-123',
  vendorId: 'vend-123',
  totalAmountPaise: 50000,
  paymentMethod: 'cod', // Testing the Cash on Delivery warning
  currentStatus: 'ready'
} as any;

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [showProofScreen, setShowProofScreen] = useState(false);

  if (showProofScreen) {
    return <DeliveryProof />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Dashboard</Text>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
            <Text style={styles.btnText}>Simulate Incoming Dispatch</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={() => setShowProofScreen(true)}>
            <Text style={styles.btnText}>Test Delivery Proof Flow</Text>
        </TouchableOpacity>
      </View>

      <DispatchOfferModal
        isVisible={modalVisible}
        order={mockOrder}
        onAccept={() => setModalVisible(false)}
        onReject={() => setModalVisible(false)}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#ffffff' },
  btnContainer: { gap: 16 },
  btn: { backgroundColor: '#1E6FBF', padding: 16, borderRadius: 8, alignItems: 'center' },
  secondaryBtn: { backgroundColor: '#CC0000' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
