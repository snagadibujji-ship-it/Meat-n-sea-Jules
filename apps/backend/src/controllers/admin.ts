import { Request, Response } from 'express';
import Order from '../models/Order';

// =========================================================================
// LEAN ADMIN ANALYTICS
// No heavy charting tools. Just pure $match, $group, $sort integer math.
// =========================================================================
export const getDailyReport = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight today

    const pipeline: any[] = [
      {
        $match: {
          createdAt: { $gte: today },
          currentStatus: { $ne: 'cancelled' } // Only count active/successful
        }
      },
      {
        $facet: {
          "totals": [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                grossRevenuePaise: { $sum: "$totalAmountPaise" }
              }
            }
          ],
          "vendors": [
            {
              $group: {
                _id: "$vendorId",
                volume: { $sum: 1 }
              }
            },
            {
              $sort: { volume: -1 }
            },
            {
              $limit: 1
            }
          ]
        }
      }
    ];

    const results = await Order.aggregate(pipeline);
    const data = results[0];

    const totalOrders = data.totals.length > 0 ? data.totals[0].totalOrders : 0;
    const grossRevenuePaise = data.totals.length > 0 ? data.totals[0].grossRevenuePaise : 0;

    // Platform fee (e.g., flat 10% commission via integer math)
    const platformFeePaise = Math.round(grossRevenuePaise * 0.10);

    const topVendorId = data.vendors.length > 0 ? data.vendors[0]._id : null;

    res.json({
      totalOrders,
      grossRevenuePaise,
      platformFeePaise,
      topVendorId
    });
  } catch (error) {
    console.error('Admin Daily Report Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
