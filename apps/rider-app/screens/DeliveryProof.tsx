import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DeliveryProof() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [otp, setOtp] = useState('');

  const order = { id: '123', sourceMode: 'studio' };
  const isStudio = order.sourceMode === 'studio';

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.5 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const submitProof = async () => {
    if (!imageUri) { Alert.alert('Error', 'Photo proof is strictly mandatory.'); return; }
    if (isStudio && otp.length !== 4) { Alert.alert('Error', 'Studio orders require a 4-digit OTP.'); return; }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert('Success', 'Delivery completed successfully!');
      setImageUri(null);
      setOtp('');
    }, 1000);
  };

  return (
    <ScrollView style={[styles.container, isStudio && styles.containerStudio]} contentContainerStyle={{ alignItems: 'center' }}>
      <Text style={[styles.title, isStudio && styles.titleStudio]}>Complete Delivery</Text>

      {isStudio && (
          <View style={styles.studioBanner}>
              <Text style={styles.studioBannerText}>✦ Studio Order - High Priority</Text>
          </View>
      )}

      <View style={[styles.card, isStudio && styles.cardStudio]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={[styles.placeholder, isStudio && styles.placeholderStudio]}>
                <Text style={styles.placeholderText}>Mandatory Photo Proof</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.cameraBtn, isStudio && styles.cameraBtnStudio]} onPress={takePhoto}>
            <Text style={[styles.cameraBtnText, isStudio && styles.cameraBtnTextStudio]}>
                {imageUri ? 'Retake Photo' : 'Open Camera'}
            </Text>
          </TouchableOpacity>
      </View>

      {isStudio && (
          <View style={[styles.otpContainer, !imageUri && styles.otpContainerDisabled]}>
              <Text style={styles.otpLabel}>Customer Delivery OTP</Text>
              <TextInput
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="• • • •"
                  placeholderTextColor="#4d4635"
                  value={otp}
                  onChangeText={setOtp}
                  editable={!!imageUri}
              />
              {!imageUri && <Text style={styles.lockText}>Take photo first to unlock OTP</Text>}
          </View>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, isStudio && styles.submitBtnStudio, (!imageUri || isUploading || (isStudio && otp.length !== 4)) && styles.submitBtnDisabled]}
        onPress={submitProof}
        disabled={!imageUri || isUploading || (isStudio && otp.length !== 4)}
      >
        <Text style={[styles.submitBtnText, isStudio && styles.submitBtnTextStudio]}>
            {isUploading ? 'Verifying...' : 'Complete Delivery'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fd' },
  containerStudio: { backgroundColor: '#0a0a0a' },
  title: { fontSize: 28, fontWeight: '800', color: '#003366', marginBottom: 24, marginTop: 40 },
  titleStudio: { color: '#e5e2e1' },

  studioBanner: { backgroundColor: '#c41e3a', padding: 12, borderRadius: 12, marginBottom: 24, width: '100%', alignItems: 'center' },
  studioBannerText: { color: '#f2ca50', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },

  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 32, width: '100%', borderWidth: 1, borderColor: '#EBEBEB' },
  cardStudio: { backgroundColor: '#131313', borderColor: '#353534' },

  imagePreview: { width: 250, height: 350, borderRadius: 16, marginBottom: 24 },
  placeholder: { width: 250, height: 350, backgroundColor: '#f4f6fa', borderRadius: 16, marginBottom: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#c3c6d1', borderStyle: 'dashed' },
  placeholderStudio: { backgroundColor: '#1c1b1b', borderColor: '#4d4635' },
  placeholderText: { color: '#737780', fontWeight: 'bold' },

  cameraBtn: { backgroundColor: '#006875', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999 },
  cameraBtnStudio: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#00ffff' },
  cameraBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  cameraBtnTextStudio: { color: '#00ffff' },

  otpContainer: { width: '100%', marginBottom: 32, alignItems: 'center' },
  otpContainerDisabled: { opacity: 0.5 },
  otpLabel: { color: '#e5e2e1', fontSize: 14, marginBottom: 12, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
  otpInput: { backgroundColor: '#131313', color: '#d4af37', fontSize: 36, fontWeight: '900', textAlign: 'center', paddingVertical: 16, borderRadius: 16, width: 220, letterSpacing: 12, borderWidth: 1, borderColor: '#353534' },
  lockText: { color: '#c41e3a', marginTop: 12, fontWeight: 'bold' },

  submitBtn: { backgroundColor: '#10B981', padding: 20, borderRadius: 999, alignItems: 'center', width: '100%', marginBottom: 40 },
  submitBtnStudio: { backgroundColor: '#d4af37' },
  submitBtnDisabled: { backgroundColor: '#e0e3e6', opacity: 0.7 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  submitBtnTextStudio: { color: '#0a0a0a' },
});
