import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { t } from 'shared';

// Mock Data for Demo
const mockAddresses = [
  { id: '1', label: 'Home', streetAddress: '123 Main St, Appt 4B' },
  { id: '2', label: 'Work', streetAddress: '456 Business Park, Suite 100' },
];

export default function Checkout() {
  const [note, setNote] = useState('');
  const [coupon, setCoupon] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>('1');

  // Hardcoded subtotal for demo
  const subtotalPaise = 50000; // ₹500
  const [discountPaise, setDiscountPaise] = useState(0);

  const applyCoupon = () => {
    // Mock coupon logic: 'WELCOME10' gives 10% off (max ₹50)
    if (coupon.toUpperCase() === 'WELCOME10') {
      const calcDiscount = Math.floor(subtotalPaise * 0.1);
      setDiscountPaise(Math.min(calcDiscount, 5000)); // ₹50 max
    } else {
      setDiscountPaise(0);
      alert('Invalid or expired coupon code.');
    }
  };

  const finalTotalPaise = subtotalPaise - discountPaise;

  const renderAddress = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddressId === item.id && styles.selectedAddressCard
      ]}
      onPress={() => setSelectedAddressId(item.id)}
    >
      <Text style={styles.addressLabel}>{item.label}</Text>
      <Text style={styles.addressText} numberOfLines={2}>{item.streetAddress}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('checkout')}</Text>

      {/* Addresses */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Saved Address</Text>
        <FlatList
          horizontal
          data={mockAddresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        />
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={styles.label}>{t('customerNote')}</Text>
        <TextInput
          style={styles.inputMultiline}
          multiline
          numberOfLines={3}
          maxLength={250}
          placeholder="e.g., Please clean the fish and cut into medium pieces."
          placeholderTextColor="#6b7280"
          value={note}
          onChangeText={setNote}
        />
        <Text style={styles.charCount}>{note.length}/250</Text>
      </View>

      {/* Coupon */}
      <View style={styles.section}>
        <Text style={styles.label}>Apply Promo Code</Text>
        <View style={styles.couponRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g., WELCOME10"
            placeholderTextColor="#6b7280"
            value={coupon}
            onChangeText={setCoupon}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>₹{(subtotalPaise / 100).toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Discount</Text>
          <Text style={styles.discountText}>- ₹{(discountPaise / 100).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹{(finalTotalPaise / 100).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Place Order (₹{(finalTotalPaise / 100).toFixed(2)})</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0A0F1D',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#171f33',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    width: 200,
  },
  selectedAddressCard: {
    borderColor: '#1E6FBF', // Brand Blue
    backgroundColor: '#1E6FBF20',
  },
  addressLabel: {
    color: '#FFD400', // Brand Yellow
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  addressText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  inputMultiline: {
    backgroundColor: '#171f33',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#374151',
  },
  input: {
    flex: 1,
    backgroundColor: '#171f33',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  charCount: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 12,
  },
  applyBtn: {
    backgroundColor: '#171f33',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD400',
  },
  applyBtnText: {
    color: '#FFD400',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#171f33',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  discountText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    marginTop: 4,
  },
  totalText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    backgroundColor: '#CC0000', // Brand Red
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  }
});
