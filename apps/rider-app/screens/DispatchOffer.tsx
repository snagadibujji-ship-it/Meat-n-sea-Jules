import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface Props {
  isVisible: boolean;
  order: any | null;
  onAccept: () => void;
  onReject: () => void;
}

export default function DispatchOfferModal({ isVisible, order, onAccept, onReject }: Props) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onReject();
    }
  }, [isVisible, timeLeft]);

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

// Stitch Theme: Oceanic Premium Commerce (Rider perspective is functional)
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,30,64,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: '#ffffff', borderRadius: 24, padding: 24, alignItems: 'center', overflow: 'hidden' },
  modalCardPriority: { borderWidth: 2, borderColor: '#d4af37', backgroundColor: '#0a0a0a' },

  priorityBanner: { backgroundColor: '#c41e3a', width: '120%', paddingVertical: 12, alignItems: 'center', marginBottom: 20, marginTop: -24 },
  priorityBannerText: { color: '#f2ca50', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },

  header: { fontSize: 24, fontWeight: '800', marginBottom: 12, color: '#003366', textAlign: 'center' },
  timerText: { fontSize: 42, fontWeight: '900', color: '#FF6B35', marginBottom: 24 },

  warningBox: { backgroundColor: '#fef3c7', padding: 16, borderRadius: 16, borderColor: '#F59E0B', borderWidth: 1, marginBottom: 24, width: '100%' },
  warningText: { color: '#d97706', fontWeight: '800', fontSize: 16, marginBottom: 4 },
  warningSubText: { color: '#b45309', fontSize: 14, lineHeight: 20 },

  actions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 16 },
  button: { flex: 1, paddingVertical: 18, borderRadius: 999, alignItems: 'center' },

  rejectBtn: { backgroundColor: '#f2f4f8', borderWidth: 1, borderColor: '#EBEBEB' },
  acceptBtn: { backgroundColor: '#FF6B35', shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  acceptBtnPriority: { backgroundColor: '#d4af37' },

  buttonText: { fontWeight: '800', fontSize: 16, color: '#001e40' },
  buttonTextPriority: { color: '#0a0a0a' }
});
