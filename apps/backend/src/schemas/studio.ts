import { z } from 'zod';

export const createCollectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
  products: z.array(z.string()).optional(),
});

export const updateFreshnessSchema = z.object({
  catchTime: z.string().datetime(),
  harbourArrivalTime: z.string().datetime(),
  processedTime: z.string().datetime(),
});
