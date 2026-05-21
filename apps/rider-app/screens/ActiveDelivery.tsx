import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useSocket } from 'shared';

export default function ActiveDelivery({ orderId, riderId }: { orderId: string, riderId: string }) {
    const socket = useSocket('rider', riderId);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        const startTracking = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 10000, // Emit every 10 seconds
                    distanceInterval: 10, // Or every 10 meters
                },
                (location) => {
                    if (socket) {
                        socket.emit('rider_location_update', {
                            orderId,
                            lat: location.coords.latitude,
                            lng: location.coords.longitude
                        });
                    }
                }
            );
        };

        startTracking();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [socket, orderId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delivery in Progress</Text>
            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : (
                <View style={styles.statusBox}>
                    <Text style={styles.statusText}>📡 Broadcasting live location...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0F1D', alignItems: 'center', justifyContent: 'center' },
    title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    errorText: { color: '#CC0000', fontWeight: 'bold' },
    statusBox: { backgroundColor: '#1E6FBF20', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#1E6FBF' },
    statusText: { color: '#1E6FBF', fontSize: 16, fontWeight: 'bold' }
});
