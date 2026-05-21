import { Request, Response } from 'express';
import Rider from '../models/Rider';
import Order from '../models/Order';
import Vendor from '../models/Vendor';
import mongoose from 'mongoose';
import { redisClient } from '../utils/redis';

// =========================================================================
// DISPATCH CONTROLLER: Find nearest rider & Offer
// Uses MongoDB native $geoNear - NO EXTERNAL PAID MAPPING APIs!
// =========================================================================
export const dispatchToNearestRider = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.currentStatus !== 'ready') {
      return res.status(400).json({ error: 'Order must be ready before dispatch' });
    }

    // Check REAL Redis for an active offer
    const redisKey = `dispatch:${orderId}`;
    const existingOffer = await redisClient.get(redisKey);

    if (existingOffer) {
      return res.status(409).json({ error: 'Order already has an active dispatch offer pending' });
    }

    const vendor = await Vendor.findById(order.vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    // Native $geoNear for finding nearest available rider
    const availableRiders = await Rider.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [vendor.location.coordinates[0], vendor.location.coordinates[1]],
          },
          distanceField: 'distance',
          maxDistance: 10000, // Search within 10km radius
          spherical: true,
          query: { isOnline: true, status: 'available' },
        },
      },
      { $limit: 1 }
    ]);

    if (availableRiders.length === 0) {
      return res.status(404).json({ error: 'No available riders nearby' });
    }

    const selectedRiderId = availableRiders[0]._id.toString();

    // Store dispatch in REAL Redis with EXACT 60-second TTL
    // Using SETEX: key, seconds, value
    await redisClient.setex(redisKey, 60, selectedRiderId);

    // Update order with the offered rider
    order.offeredRiderId = new mongoose.Types.ObjectId(selectedRiderId);
    await order.save();

    res.json({
        message: 'Dispatch offered to rider',
        riderId: selectedRiderId,
        expiresIn: 60
    });
  } catch (error) {
    console.error('Dispatch Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
