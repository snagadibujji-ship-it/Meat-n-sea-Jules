import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface Props {
  isVisible: boolean;
  order: any | null; // Using any for demo, normally Order type
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

  const isPriority = order.deliveryTier === 'priority';

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalCard, isPriority && styles.modalCardPriority]}>

          {isPriority && (
              <View style={styles.priorityBanner}>
                  <Text style={styles.priorityBannerText}>✦ Studio Delivery - Handle with Care</Text>
              </View>
          )}

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
            <TouchableOpacity style={[styles.button, styles.acceptBtn, isPriority && styles.acceptBtnPriority]} onPress={onAccept}>
              <Text style={[styles.buttonText, isPriority && styles.buttonTextPriority]}>Accept</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#171f33', borderRadius: 16, padding: 24, alignItems: 'center', overflow: 'hidden' },
  modalCardPriority: { borderWidth: 2, borderColor: '#FFD400' },
  priorityBanner: { backgroundColor: '#CC0000', width: '120%', paddingVertical: 8, alignItems: 'center', marginBottom: 16, marginTop: -24 },
  priorityBannerText: { color: '#FFD400', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#ffffff' },
  timerText: { fontSize: 36, fontWeight: '900', color: '#CC0000', marginBottom: 24 },
  warningBox: { backgroundColor: '#fef3c7', padding: 16, borderRadius: 8, borderColor: '#f59e0b', borderWidth: 1, marginBottom: 24, width: '100%' },
  warningText: { color: '#d97706', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  warningSubText: { color: '#b45309', fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 16 },
  button: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  rejectBtn: { backgroundColor: '#374151' },
  acceptBtn: { backgroundColor: '#1E6FBF' },
  acceptBtnPriority: { backgroundColor: '#FFD400' },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#ffffff' },
  buttonTextPriority: { color: '#000000' }
});
