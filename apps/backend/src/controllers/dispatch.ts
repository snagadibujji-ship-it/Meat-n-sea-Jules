import { Request, Response } from 'express';
import Rider from '../models/Rider';
import Order from '../models/Order';
import redisClient from '../utils/redis';

// =========================================================================
// SPRINT B: PUSH DISPATCH LOGIC (Cron/Webhook Triggered)
// Automatically matches an unassigned order to the nearest available rider
// =========================================================================
export const dispatchToNearestRider = async (req: Request, res: Response) => {
  try {
    // Priority Execution Update: Find the oldest pending order, sorting by priority FIRST
    // Sort logic: 'priority' sorts before 'standard' alphabetically if we do descending?
    // Wait, let's explicitly sort by deliveryTier (priority = 1, standard = 2 basically, or just descending string sort works because p > s... wait p is before s.
    // Let's rely on an explicit pipeline or simple string sort: 'standard', 'priority'. descending sort puts 'standard' first.
    // Better: Sort by `{ deliveryTier: -1, createdAt: 1 }`. Wait, priority (p) < standard (s).
    // Actually, `priority` < `standard`. So ascending sort puts `priority` first.
    const order = await Order.findOne({
      currentStatus: 'pending',
      offeredRiderId: { $exists: false }
    }).populate('vendorId')
      .sort({ deliveryTier: 1, createdAt: 1 }); // 1 = ascending (p comes before s)

    if (!order) {
      return res.status(200).json({ message: 'No pending unassigned orders.' });
    }

    const vendor = order.vendorId as any;

    if (!vendor || !vendor.location) {
        return res.status(400).json({ error: 'Vendor location missing for dispatch' });
    }

    // Zero-Cost $geoNear to find nearest available rider
    const nearestRiders = await Rider.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: vendor.location.coordinates,
          },
          distanceField: 'distance',
          spherical: true,
          query: {
            status: 'online',
            currentOrderId: { $exists: false }
          }, // Must be online and not currently assigned
        },
      },
      { $limit: 1 }
    ]);

    if (nearestRiders.length === 0) {
      return res.status(200).json({ message: 'No available riders nearby.' });
    }

    const rider = nearestRiders[0];

    // Atomically lock the order to this rider temporarily
    order.offeredRiderId = rider._id;
    await order.save();

    // SPRINT B: Redis TTL for exactly 60 seconds
    const redisKey = `dispatch:offer:${order._id.toString()}`;
    await redisClient.setEx(redisKey, 60, rider._id.toString());

    // In a real app: Send Push Notification to Rider here!

    res.json({
        message: 'Dispatch offer sent',
        orderId: order._id,
        riderId: rider._id,
        tier: order.deliveryTier
    });

  } catch (error) {
    console.error('Dispatch Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
