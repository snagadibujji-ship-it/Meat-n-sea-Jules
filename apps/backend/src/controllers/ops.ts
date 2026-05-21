import { Request, Response } from 'express';
import Vendor from '../models/Vendor';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import Coupon from '../models/Coupon';
import Ledger from '../models/Ledger';
import { getIO } from '../socket';

// =========================================================================
// GEO-MATH CONTROLLER: Find nearby open vendors
// Uses MongoDB native $geoNear - NO EXTERNAL PAID MAPPING APIs!
// =========================================================================
export const getNearbyVendors = async (req: Request, res: Response) => {
  try {
    const { lng, lat, maxDistance = 5000, mode = 'bazaar' } = req.query; // maxDistance in meters (5km default)

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const now = new Date();
    const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

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
          query: {
            isMnsStudio: mode === 'studio',
            isOpen: true,
            $or: [
              { 'businessHours': { $exists: false } },
              {
                'businessHours.openTime': { $lte: currentHourMin },
                'businessHours.closeTime': { $gte: currentHourMin }
              }
            ]
          },
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
// SPRINT C: WHATSAPP FALLBACK LINK
// =========================================================================
export const getOrderWhatsAppLink = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Fetch order and populate vendor to get the phone number
    const order = await Order.findById(orderId).populate('vendorId', 'phone name');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const vendor = order.vendorId as any; // Type override since it's populated
    if (!vendor || !vendor.phone) {
        return res.status(404).json({ error: 'Vendor contact information not available' });
    }

    // Format phone number (assuming +91 is implicitly needed or stored in DB)
    const phone = vendor.phone.startsWith('+91') ? vendor.phone.replace('+91', '91') : `91${vendor.phone}`;

    // Construct zero-cost WhatsApp deep link
    const text = encodeURIComponent(`Hello ${vendor.name}, I am checking on Order #${order._id.toString()}.`);
    const link = `https://wa.me/${phone}?text=${text}`;

    res.json({ link });
  } catch (error) {
    console.error('WhatsApp Link Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// VENDOR CONTROLLER: Toggle Open/Closed Status
// =========================================================================
export const toggleVendorStatus = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { isOpen } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    vendor.isOpen = isOpen;
    if (!isOpen) {
      vendor.status = 'closed';
    } else {
      vendor.status = 'open'; // simplified default flow
    }

    await vendor.save();
    res.json(vendor);
  } catch (error) {
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
    const io = getIO();
    io.to(`order_${orderId}`).emit('status_change', { newStatus });


    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// SPAM PROTECTION & CHECKOUT: Place order check
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

    const { vendorId, userLocation, customerNote, couponCode, items } = req.body; // userLocation expects { lng: number, lat: number }
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

    // Ledger Math: Calculate Subtotal natively in Paise
    let subtotalPaise = 0;
    if (items && items.length > 0) {
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.isOutOfStock) {
           return res.status(400).json({ error: `Product ${item.productId} is out of stock or invalid` });
        }
        subtotalPaise += product.pricePaise * item.quantity;
      }
    } else {
      // Demo fallback if items aren't strictly passed
      subtotalPaise = 50000; // ₹500
    }

    let discountPaise = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (coupon) {
        // Calculate discount safely in integers
        const calculatedDiscount = Math.floor((subtotalPaise * coupon.discountPercentage) / 100);
        discountPaise = Math.min(calculatedDiscount, coupon.maxDiscountPaise);
      }
    }

    const finalTotalPaise = subtotalPaise - discountPaise;

    // Platform Commission (e.g., 10%)
    const platformFeePaise = Math.floor((subtotalPaise * 10) / 100);

    // Create Order
    // Generate OTP for Studio Orders
    const isStudio = req.body.sourceMode === 'studio';
    const deliveryOtp = isStudio ? Math.floor(1000 + Math.random() * 9000).toString() : undefined;
    const order = await Order.create({
      customerId: userId,
      vendorId: vendor._id,
      totalAmountPaise: finalTotalPaise,
      paymentMethod: req.body.paymentMethod || 'online',
      sourceMode: req.body.sourceMode || 'bazaar',
      deliveryTier: req.body.deliveryTier || 'standard',
      deliveryOtp,
      customerNote
    });

    // Create Ledger Entry
    // Emit Real-Time Vendor Alert
    const io = getIO();
    io.to(`vendor_${vendor._id}`).emit('new_order', { orderId: order._id, totalAmountPaise: finalTotalPaise });

    await Ledger.create({
      orderId: order._id,
      totalAmountPaise: finalTotalPaise,
      paymentMethod: order.paymentMethod,
      platformFeePaise,
      discountPaise,
    });

    res.status(201).json({ message: 'Order created successfully', order, discountPaise, finalTotalPaise, platformFeePaise });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// PRODUCT CONTROLLER: Get products by vendor and mode
// =========================================================================
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { vendorId, mode = 'bazaar' } = req.query;

    if (!vendorId) {
      return res.status(400).json({ error: 'Vendor ID is required' });
    }

    // Filter dynamically so studio requests only pull products where supportedMode is 'studio' or 'both'
    const query: any = { vendorId };

    if (mode === 'studio') {
      query.supportedMode = { $in: ['studio', 'both'] };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// =========================================================================
// ORDER COMPLETION CONTROLLER (Rider flow with OTP gate)
// =========================================================================
export const completeOrderDelivery = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { otp, proofOfDeliveryUrl } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.sourceMode === 'studio') {
        if (!proofOfDeliveryUrl) {
             return res.status(400).json({ error: 'Proof of Delivery photo is strictly mandatory for Studio orders.' });
        }
        if (!otp || otp !== order.deliveryOtp) {
            return res.status(400).json({ error: 'Invalid Delivery OTP.' });
        }
    }

    // Validated, mark complete
    order.proofOfDeliveryUrl = proofOfDeliveryUrl;
    order.updateStatus('delivered');
    await order.save();

    const io = getIO();
    io.to(`order_${orderId}`).emit('status_change', { newStatus: 'delivered' });

    res.json({ message: 'Delivery Completed' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
