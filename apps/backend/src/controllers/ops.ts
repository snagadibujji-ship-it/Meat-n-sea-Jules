import { Request, Response } from 'express';
import Vendor from '../models/Vendor';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';

// =========================================================================
// GEO-MATH CONTROLLER: Find nearby open vendors
// Uses MongoDB native $geoNear - NO EXTERNAL PAID MAPPING APIs!
// =========================================================================
export const getNearbyVendors = async (req: Request, res: Response) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters (5km default)

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const vendors = await Vendor.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          distanceField: 'distance',
          maxDistance: parseInt(maxDistance as string),
          spherical: true,
          query: { isOpen: true }, // Filter to only open vendors immediately
        },
      },
    ]);

    res.json(vendors);
  } catch (error) {
    console.error('GeoNear Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// INVENTORY CONTROLLER: Vendor 1-click toggle stock
// =========================================================================
export const toggleProductStock = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { stockQuantity } = req.body; // Can pass raw quantity from UI

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Set stock and manually or implicitly toggle the boolean flag
    if (stockQuantity !== undefined) {
        product.stockQuantity = stockQuantity;
    } else {
        // Simple toggle boolean bypass if no specific quantity sent
        product.isOutOfStock = !product.isOutOfStock;
        if (product.isOutOfStock) product.stockQuantity = 0;
    }

    await product.save(); // Will trigger pre-save hook to enforce `isOutOfStock` if quantity hits 0

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// ORDER PIPELINE CONTROLLER: Push timeline events
// =========================================================================
export const advanceOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body; // e.g., 'preparing' -> 'out_for_delivery'

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.updateStatus(newStatus); // This triggers our custom schema method
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// SPAM PROTECTION: Place order check
// =========================================================================
export const placeOrder = async (req: Request, res: Response) => {
  try {
    // Note: Assuming `req.user` contains decoded JWT payload with `userId`
    const userId = (req as any).user?.id || req.body.customerId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Enforce limits immediately!
    const canPlace = await user.canPlaceOrder();
    if (!canPlace) {
        return res.status(403).json({
            error: 'Cannot place order. Ensure your phone is verified and you have fewer than 5 active orders.'
        });
    }

    const { vendorId, userLocation } = req.body; // userLocation expects { lng: number, lat: number }
    if (!vendorId || !userLocation) {
        return res.status(400).json({ error: 'vendorId and userLocation are required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor || !vendor.isOpen) {
        return res.status(400).json({ error: 'Vendor is closed or not found' });
    }

    // Missing requirement: Order Radius Gating via $nearSphere
    // Check if the user is within the vendor's serviceRadiusKm
    const distanceCheck = await Vendor.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(userLocation.lng), parseFloat(userLocation.lat)]
                },
                distanceField: 'distance',
                spherical: true,
                query: { _id: vendor._id },
            }
        }
    ]);

    if (distanceCheck.length === 0) {
        return res.status(400).json({ error: 'Distance check failed' });
    }

    const distanceInMeters = distanceCheck[0].distance;
    const distanceInKm = distanceInMeters / 1000;

    if (distanceInKm > vendor.serviceRadiusKm) {
        return res.status(403).json({ error: `Out of delivery range. Vendor only serves within ${vendor.serviceRadiusKm}km.` });
    }

    // Proceed with atomic order creation logic here...
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
