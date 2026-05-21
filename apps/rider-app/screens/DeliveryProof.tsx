import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DeliveryProof() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    if (!imageUri) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'proof.jpg',
        type: 'image/jpeg',
      } as any);

      // In a real app, this would be your API URL
      // const response = await fetch('YOUR_API_URL/api/upload', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // const data = await response.json();
      // Then send the data.imageUrl to your order completion endpoint

      setTimeout(() => {
        setIsUploading(false);
        Alert.alert('Success', 'Delivery completed successfully!');
        setImageUri(null); // Reset for next delivery
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Error', 'Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proof of Delivery</Text>

      <View style={styles.card}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No photo captured</Text>
            </View>
          )}

          <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
            <Text style={styles.cameraBtnText}>
                {imageUri ? 'Retake Photo' : 'Open Camera'}
            </Text>
          </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, (!imageUri || isUploading) && styles.submitBtnDisabled]}
        onPress={submitProof}
        disabled={!imageUri || isUploading}
      >
        <Text style={styles.submitBtnText}>
            {isUploading ? 'Uploading...' : 'Complete Delivery'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0A0F1D', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: '#171f33', padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
  imagePreview: { width: 250, height: 350, borderRadius: 8, marginBottom: 24 },
  placeholder: { width: 250, height: 350, backgroundColor: '#0A0F1D', borderRadius: 8, marginBottom: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#374151', borderStyle: 'dashed' },
  placeholderText: { color: '#6b7280', fontWeight: 'bold' },
  cameraBtn: { backgroundColor: '#1E6FBF', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  cameraBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  submitBtn: { backgroundColor: '#22c55e', padding: 18, borderRadius: 8, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: '#374151' },
  submitBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
});
