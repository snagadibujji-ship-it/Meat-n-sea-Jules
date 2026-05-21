import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
    lat: z.string().regex(/^-?\d+(\.\d+)?$/, 'Valid latitude required'),
    lng: z.string().regex(/^-?\d+(\.\d+)?$/, 'Valid longitude required'),
    radiusKm: z.string().regex(/^\d+(\.\d+)?$/, 'Valid radius required').optional(),
  })
});
