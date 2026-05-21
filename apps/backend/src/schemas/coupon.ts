import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(1, 'Code is required').toUpperCase(),
  discountPercentage: z.number().min(0).max(100),
  maxDiscountPaise: z.number().int().min(0),
  expiresAt: z.string().datetime(), // ISO 8601
});
