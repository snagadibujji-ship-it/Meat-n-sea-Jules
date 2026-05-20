import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Order } from 'shared';

interface Props {
  isVisible: boolean;
  order: Order | null;
  onAccept: () => void;
  onReject: () => void;
}

export default function DispatchOfferModal({ isVisible, order, onAccept, onReject }: Props) {
  const [timeLeft, setTimeLeft] = useState(60);

  // 60-Second Redis TTL Visual Simulation
  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onReject(); // Auto-reject when TTL expires
    }
  }, [isVisible, timeLeft]);

  // Reset timer when modal becomes visible for a new order
  useEffect(() => {
    if (isVisible) setTimeLeft(60);
  }, [isVisible, order]);

  if (!order) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>

          <Text style={styles.header}>New Delivery Offer!</Text>
          <Text style={styles.timerText}>{timeLeft}s remaining</Text>

          {/* SPRINT D: COD Collect Cash Warning */}
          {order.paymentMethod === 'cod' && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>⚠️ CASH ON DELIVERY</Text>
              <Text style={styles.warningSubText}>You must collect the physical cash from the customer before handing over the delivery.</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.rejectBtn]} onPress={onReject}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.acceptBtn]} onPress={onAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  timerText: { fontSize: 36, fontWeight: '900', color: '#ef4444', marginBottom: 24 },
  warningBox: { backgroundColor: '#fef3c7', padding: 16, borderRadius: 8, borderColor: '#f59e0b', borderWidth: 1, marginBottom: 24, width: '100%' },
  warningText: { color: '#d97706', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  warningSubText: { color: '#b45309', fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 16 },
  button: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  rejectBtn: { backgroundColor: '#e5e7eb' },
  acceptBtn: { backgroundColor: '#3b82f6' },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#1f2937' },
});
