import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DeliveryProof() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [otp, setOtp] = useState('');

  // Mock order for demo. In reality, passed via props/navigation
  const order = {
      id: '123',
      sourceMode: 'studio',
  };

  const isStudio = order.sourceMode === 'studio';

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitProof = async () => {
    if (!imageUri) {
        Alert.alert('Error', 'Photo proof is strictly mandatory.');
        return;
    }

    if (isStudio && otp.length !== 4) {
        Alert.alert('Error', 'Studio orders require a 4-digit OTP from the customer.');
        return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'proof.jpg',
        type: 'image/jpeg',
      } as any);

      // In a real app:
      // 1. Upload image
      // 2. Call POST /api/orders/:orderId/complete with otp and proofOfDeliveryUrl

      setTimeout(() => {
        setIsUploading(false);
        Alert.alert('Success', 'Delivery completed successfully!');
        setImageUri(null);
        setOtp('');
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Error', 'Upload failed');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      <Text style={styles.title}>Complete Delivery</Text>

      {isStudio && (
          <View style={styles.studioBanner}>
              <Text style={styles.studioBannerText}>✦ Studio Order - High Priority</Text>
          </View>
      )}

      <View style={styles.card}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Mandatory Photo Proof</Text>
            </View>
          )}

          <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
            <Text style={styles.cameraBtnText}>
                {imageUri ? 'Retake Photo' : 'Open Camera'}
            </Text>
          </TouchableOpacity>
      </View>

      {/* OTP Gate renders ONLY if photo is captured for Studio orders (or always visible but enforced) */}
      {isStudio && (
          <View style={[styles.otpContainer, !imageUri && styles.otpContainerDisabled]}>
              <Text style={styles.otpLabel}>Customer Delivery OTP</Text>
              <TextInput
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="• • • •"
                  placeholderTextColor="#6b7280"
                  value={otp}
                  onChangeText={setOtp}
                  editable={!!imageUri} // Lock until photo is taken
              />
              {!imageUri && <Text style={styles.lockText}>Take photo first to unlock OTP</Text>}
          </View>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, (!imageUri || isUploading || (isStudio && otp.length !== 4)) && styles.submitBtnDisabled]}
        onPress={submitProof}
        disabled={!imageUri || isUploading || (isStudio && otp.length !== 4)}
      >
        <Text style={styles.submitBtnText}>
            {isUploading ? 'Verifying...' : 'Complete Delivery'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0A0F1D' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 16, marginTop: 40 },
  studioBanner: { backgroundColor: '#CC0000', padding: 8, borderRadius: 8, marginBottom: 24, width: '100%', alignItems: 'center' },
  studioBannerText: { color: '#FFD400', fontWeight: 'bold' },
  card: { backgroundColor: '#171f33', padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 32, width: '100%' },
  imagePreview: { width: 250, height: 350, borderRadius: 8, marginBottom: 24 },
  placeholder: { width: 250, height: 350, backgroundColor: '#0A0F1D', borderRadius: 8, marginBottom: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#374151', borderStyle: 'dashed' },
  placeholderText: { color: '#6b7280', fontWeight: 'bold' },
  cameraBtn: { backgroundColor: '#1E6FBF', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  cameraBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  otpContainer: { width: '100%', marginBottom: 32, alignItems: 'center' },
  otpContainerDisabled: { opacity: 0.5 },
  otpLabel: { color: '#ffffff', fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
  otpInput: { backgroundColor: '#171f33', color: '#FFD400', fontSize: 32, fontWeight: '900', textAlign: 'center', padding: 16, borderRadius: 8, width: 200, letterSpacing: 8, borderWidth: 1, borderColor: '#374151' },
  lockText: { color: '#ef4444', marginTop: 8, fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#22c55e', padding: 18, borderRadius: 8, alignItems: 'center', width: '100%', marginBottom: 40 },
  submitBtnDisabled: { backgroundColor: '#374151' },
  submitBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
});
