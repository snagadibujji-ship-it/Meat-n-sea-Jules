import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DispatchOfferModal from './screens/DispatchOffer';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Dashboard</Text>

      <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>Simulate Incoming Dispatch</Text>
      </TouchableOpacity>

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
