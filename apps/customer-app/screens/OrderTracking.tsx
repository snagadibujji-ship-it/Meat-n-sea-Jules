import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useOrderWhatsAppLink, Order } from 'shared'; // Assuming order data is passed or fetched

interface Props {
  order: Order; // Simulating prop passing from navigation
}

export default function OrderTracking({ order }: Props) {
  // Use React Query to fetch the zero-cost WhatsApp fallback link
  const { data, isLoading } = useOrderWhatsAppLink(order?.id || 'mock-id');

  const handleWhatsAppChat = () => {
    if (data?.link) {
      Linking.openURL(data.link).catch(() => {
        alert('Make sure WhatsApp is installed on your device.');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Order #{order?.id || '123'}</Text>

      <View style={styles.timeline}>
        {order?.statusTimeline?.map((item, index) => {
          const formattedTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.node} />
              <View style={styles.timelineTextContainer}>
                  <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
                  <Text style={styles.timeText}>{formattedTime}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleWhatsAppChat}
        disabled={isLoading || !data?.link}
      >
        <Text style={styles.buttonText}>
            {isLoading ? 'Loading Chat...' : 'Chat on WhatsApp (Free)'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  timeline: { paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#e5e7eb', marginBottom: 32 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, position: 'relative' },
  node: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6', position: 'absolute', left: -19 },
  timelineTextContainer: { marginLeft: 16 },
  statusText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  timeText: { fontSize: 14, color: '#6b7280' },
  button: { backgroundColor: '#25D366', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
