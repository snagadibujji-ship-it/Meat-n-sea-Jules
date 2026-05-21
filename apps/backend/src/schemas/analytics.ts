import { z } from 'zod';

export const createEventSchema = z.object({
  eventName: z.string().min(1),
  metaData: z.record(z.any()).optional(),
  userId: z.string().optional(), // In reality we'd pull from JWT
});
