import { z } from 'zod';

export const placeOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  userLocation: z.object({
    lng: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
  }),
  // Optional but recommended for our setup
  customerNote: z.string().max(250).optional(),
  sourceMode: z.enum(['bazaar', 'studio']).optional(),
  deliveryTier: z.enum(['standard', 'priority']).optional(),
  couponCode: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).optional(),
});

export const completeDeliverySchema = z.object({
  otp: z.string().length(4).optional(),
  proofOfDeliveryUrl: z.string().url().optional(),
});
