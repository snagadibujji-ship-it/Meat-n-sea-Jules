import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from 'shared';
import ModeSelection from './screens/ModeSelection';
import Home from './screens/Home';

const queryClient = new QueryClient();

// Wrap the logic in a component to use hooks
function MainApp() {
  const { hasSeenOnboarding } = useAppStore();

  if (!hasSeenOnboarding) {
    return <ModeSelection />;
  }

  return <Home />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <MainApp />
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
