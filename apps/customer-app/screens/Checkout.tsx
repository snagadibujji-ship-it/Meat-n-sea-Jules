import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from 'shared';

export default function Checkout() {
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('checkout')}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('customerNote')}</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          maxLength={250}
          placeholder="e.g., Please clean the fish and cut into medium pieces."
          placeholderTextColor="#6b7280"
          value={note}
          onChangeText={setNote}
        />
        <Text style={styles.charCount}>{note.length}/250</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0A0F1D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#171f33',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});
