import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderTracking from './screens/OrderTracking';

// Note: Using a mock order here just for integration testing purposes.
// In production, React Navigation would provide the Order ID.
const mockOrder = {
  id: '123',
  customerId: 'cust-123',
  vendorId: 'vend-123',
  totalAmountPaise: 50000,
  paymentMethod: 'online',
  currentStatus: 'preparing',
  statusTimeline: [
    { status: 'pending', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
    { status: 'accepted', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { status: 'preparing', timestamp: new Date().toISOString() },
  ]
} as any;

const queryClient = new QueryClient();

import Home from "./screens/Home";
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Home />
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
});
