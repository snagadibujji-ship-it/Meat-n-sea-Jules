import { z } from 'zod';

export const addAddressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
