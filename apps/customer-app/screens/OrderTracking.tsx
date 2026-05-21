import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useOrderWhatsAppLink, Order, useSocket } from 'shared';

interface Props {
  order: Order;
}

export default function OrderTracking({ order }: Props) {
  const { data, isLoading } = useOrderWhatsAppLink(order?.id || 'mock-id');
  const socket = useSocket('order', order?.id || 'mock-id');

  const [liveStatus, setLiveStatus] = useState<any[]>(order?.statusTimeline || []);
  const [riderLocation, setRiderLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('status_change', (data: { newStatus: string }) => {
      setLiveStatus(prev => [
          ...prev,
          { status: data.newStatus, timestamp: new Date().toISOString() }
      ]);
    });

    socket.on('rider_location_update', (data: { lat: number, lng: number }) => {
        setRiderLocation(data);
    });

    return () => {
      socket.off('status_change');
      socket.off('rider_location_update');
    };
  }, [socket]);


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

      {riderLocation && (
          <View style={styles.mapBanner}>
              <Text style={styles.mapBannerText}>
                  📍 Rider is at: {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
              </Text>
          </View>
      )}

      <View style={styles.timeline}>
        {liveStatus.map((item, index) => {
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
  container: { flex: 1, padding: 24, backgroundColor: '#0A0F1D' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#ffffff' },
  mapBanner: { backgroundColor: '#1E6FBF20', padding: 12, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#1E6FBF' },
  mapBannerText: { color: '#1E6FBF', fontWeight: 'bold', textAlign: 'center' },
  timeline: { paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#374151', marginBottom: 32 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, position: 'relative' },
  node: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1E6FBF', position: 'absolute', left: -19 },
  timelineTextContainer: { marginLeft: 16 },
  statusText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  timeText: { fontSize: 14, color: '#6b7280' },
  button: { backgroundColor: '#25D366', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
