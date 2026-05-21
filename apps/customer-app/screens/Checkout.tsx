import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { t, useAppStore } from 'shared';

// Mock Data for Demo
const mockAddresses = [
  { id: '1', label: 'Home', streetAddress: '123 Main St, Appt 4B' },
  { id: '2', label: 'Work', streetAddress: '456 Business Park, Suite 100' },
];

export default function Checkout() {
  const { mode } = useAppStore();
  const [note, setNote] = useState('');
  const [coupon, setCoupon] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>('1');

  // Hardcoded subtotal for demo
  const subtotalPaise = 50000; // ₹500
  const [discountPaise, setDiscountPaise] = useState(0);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME10') {
      const calcDiscount = Math.floor(subtotalPaise * 0.1);
      setDiscountPaise(Math.min(calcDiscount, 5000)); // ₹50 max
    } else {
      setDiscountPaise(0);
      alert('Invalid or expired coupon code.');
    }
  };

  const finalTotalPaise = subtotalPaise - discountPaise;
  const isStudio = mode === 'studio';

  const renderAddress = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        isStudio ? styles.addressCardStudio : styles.addressCardBazaar,
        selectedAddressId === item.id && (isStudio ? styles.selectedAddressStudio : styles.selectedAddressBazaar)
      ]}
      onPress={() => setSelectedAddressId(item.id)}
    >
      <Text style={[styles.addressLabel, isStudio && styles.addressLabelStudio]}>{item.label}</Text>
      <Text style={[styles.addressText, isStudio && styles.addressTextStudio]} numberOfLines={2}>{item.streetAddress}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, isStudio && styles.containerStudio]}>
      <Text style={[styles.title, isStudio && styles.titleStudio]}>{t('checkout')}</Text>

      {/* Addresses */}
      <View style={styles.section}>
        <Text style={[styles.label, isStudio && styles.labelStudio]}>Select Saved Address</Text>
        <FlatList
          horizontal
          data={mockAddresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
        />
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={[styles.label, isStudio && styles.labelStudio]}>{t('customerNote')}</Text>
        <TextInput
          style={[styles.inputMultiline, isStudio ? styles.inputStudio : styles.inputBazaar]}
          multiline
          numberOfLines={3}
          maxLength={250}
          placeholder="e.g., Please clean the fish and cut into medium pieces."
          placeholderTextColor={isStudio ? "#4d4635" : "#64748B"}
          value={note}
          onChangeText={setNote}
        />
        <Text style={styles.charCount}>{note.length}/250</Text>
      </View>

      {/* Coupon */}
      <View style={styles.section}>
        <Text style={[styles.label, isStudio && styles.labelStudio]}>Apply Promo Code</Text>
        <View style={styles.couponRow}>
          <TextInput
            style={[styles.input, isStudio ? styles.inputStudio : styles.inputBazaar]}
            placeholder="e.g., WELCOME10"
            placeholderTextColor={isStudio ? "#4d4635" : "#64748B"}
            value={coupon}
            onChangeText={setCoupon}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.applyBtn, isStudio ? styles.applyBtnStudio : styles.applyBtnBazaar]}
            onPress={applyCoupon}
          >
            <Text style={[styles.applyBtnText, isStudio && styles.applyBtnTextStudio]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary */}
      <View style={[styles.summaryCard, isStudio ? styles.summaryCardStudio : styles.summaryCardBazaar]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryText, isStudio && styles.summaryTextStudio]}>Subtotal</Text>
          <Text style={[styles.summaryText, isStudio && styles.summaryTextStudio]}>₹{(subtotalPaise / 100).toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryText, isStudio && styles.summaryTextStudio]}>Discount</Text>
          <Text style={[styles.discountText, isStudio && styles.discountTextStudio]}>- ₹{(discountPaise / 100).toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, isStudio && styles.totalRowStudio]}>
          <Text style={[styles.totalText, isStudio && styles.totalTextStudio]}>Total</Text>
          <Text style={[styles.totalText, isStudio && styles.totalTextStudio]}>₹{(finalTotalPaise / 100).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.checkoutBtn, isStudio ? styles.checkoutBtnStudio : styles.checkoutBtnBazaar]}>
          <Text style={[styles.checkoutBtnText, isStudio && styles.checkoutBtnTextStudio]}>Place Order (₹{(finalTotalPaise / 100).toFixed(2)})</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f7f9fd' },
  containerStudio: { backgroundColor: '#131313' },
  title: { fontSize: 28, fontWeight: '800', color: '#003366', marginBottom: 24, letterSpacing: -0.5 },
  titleStudio: { color: '#d4af37' },
  section: { marginBottom: 32 },
  label: { color: '#191c1f', fontSize: 14, fontWeight: '600', marginBottom: 12, letterSpacing: 0.5 },
  labelStudio: { color: '#e5e2e1' },

  addressCard: {
    padding: 16,
    width: 220,
  },
  addressCardBazaar: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  addressCardStudio: {
    backgroundColor: '#201f1f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#353534',
  },
  selectedAddressBazaar: { borderColor: '#FF6B35' },
  selectedAddressStudio: { borderColor: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.1)' },

  addressLabel: { color: '#003366', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  addressLabelStudio: { color: '#d4af37' },
  addressText: { color: '#43474f', fontSize: 14 },
  addressTextStudio: { color: '#d0c5af' },

  inputMultiline: {
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  inputBazaar: {
    backgroundColor: '#ffffff',
    borderColor: '#EBEBEB',
    color: '#191c1f',
  },
  inputStudio: {
    backgroundColor: '#1c1b1b',
    borderColor: '#353534',
    color: '#e5e2e1',
    borderRadius: 8,
  },

  charCount: { color: '#64748B', fontSize: 12, textAlign: 'right', marginTop: 8 },
  couponRow: { flexDirection: 'row', gap: 12 },

  applyBtn: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderRadius: 999, // Pill shape
    borderWidth: 1.5,
  },
  applyBtnBazaar: {
    backgroundColor: '#ffffff',
    borderColor: '#003366',
  },
  applyBtnStudio: {
    backgroundColor: 'transparent',
    borderColor: '#00ffff',
  },
  applyBtnText: { color: '#003366', fontWeight: '700' },
  applyBtnTextStudio: { color: '#00ffff' },

  summaryCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
  },
  summaryCardBazaar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  summaryCardStudio: {
    backgroundColor: '#201f1f',
    borderWidth: 1,
    borderColor: '#353534',
    borderRadius: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryText: { color: '#43474f', fontSize: 16 },
  summaryTextStudio: { color: '#d0c5af' },
  discountText: { color: '#10B981', fontSize: 16, fontWeight: '700' },
  discountTextStudio: { color: '#00ffff' },

  totalRow: {
    borderTopWidth: 1.5,
    borderTopColor: '#EBEBEB',
    paddingTop: 16,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRowStudio: { borderTopColor: '#353534' },
  totalText: { color: '#003366', fontSize: 20, fontWeight: '800' },
  totalTextStudio: { color: '#e5e2e1' },

  checkoutBtn: {
    paddingVertical: 18,
    borderRadius: 999, // Pill
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
  },
  checkoutBtnBazaar: { backgroundColor: '#FF6B35' },
  checkoutBtnStudio: { backgroundColor: '#d4af37' },
  checkoutBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  checkoutBtnTextStudio: { color: '#0a0a0a' },
});
