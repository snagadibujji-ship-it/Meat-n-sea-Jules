import { z } from 'zod';

export const placeOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  userLocation: z.object({
    lng: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
  }),
  // Optional but recommended for our setup
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).optional(),
});
