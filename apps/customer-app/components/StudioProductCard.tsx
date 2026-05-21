import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Props {
  product: any;
}

export default function StudioProductCard({ product }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>M&S</Text>
          </View>
        )}
        {/* Top-Down Lighting Highlight Simulation */}
        <View style={styles.topLight} />
      </View>
      <View style={styles.glassFooter}>
        <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>₹{(product.pricePaise / 100).toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Stitch Theme: Abyssal Gold (Studio Mode)
const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 16,
    backgroundColor: '#1c1b1b', // surface-low
    borderRadius: 16, // rounded-lg
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)', // subtle gold border
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // Android Tinted Ambient Shadow
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#0e0e0e',
    position: 'relative',
  },
  topLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Top light rim effect
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e0e0e',
  },
  placeholderText: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 24,
    opacity: 0.3,
  },
  glassFooter: {
    padding: 16,
    backgroundColor: 'rgba(32, 31, 31, 0.85)', // Glassmorphic feel
  },
  title: {
    color: '#e5e2e1', // on-surface
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    // Note: Emulating Playfair Display via standard serif if available, or just tight spacing
    letterSpacing: -0.2,
  },
  price: {
    color: '#f2ca50', // primary-light
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ffff', // Aqua Accent
    paddingVertical: 10,
    borderRadius: 999, // Pill shape
    alignItems: 'center',
  },
  addButtonText: {
    color: '#00ffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  }
});
