import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  pricePaise: z.number().int().positive(),
  intervalDays: z.number().int().positive().default(7),
  curatedItems: z.array(z.string()),
});

export const createSubscriptionSchema = z.object({
  planId: z.string().min(1),
  deliveryDay: z.string().min(1),
  deliveryAddress: z.object({
    street: z.string().min(1),
    coordinates: z.array(z.number()).length(2),
  }),
  nextDeliveryAt: z.string().datetime(),
});

export const updateSubscriptionSchema = z.object({
  status: z.enum(['active', 'paused', 'cancelled']),
});
