import { Router } from 'express';
import { getNearbyVendors, getProducts, toggleProductStock, advanceOrderStatus, placeOrder, getOrderWhatsAppLink, toggleVendorStatus } from '../controllers/ops';
import { validateRequest } from "../middlewares/validateRequest";
import { placeOrderSchema } from "../schemas/order";
import { dispatchToNearestRider } from '../controllers/dispatch';
import { requestOtp, verifyOtp } from "../controllers/auth";
import { requestOtpSchema, verifyOtpSchema } from "../schemas/auth";
import { addAddress, deleteAddress } from "../controllers/user";
import { addAddressSchema } from "../schemas/user";
import { getCollections, getCollectionBySlug, getFreshness, getStudioHome, createCollection, updateFreshness } from "../controllers/studio";
import { createCollectionSchema, updateFreshnessSchema } from "../schemas/studio";
import { createCoupon } from "../controllers/coupon";
import { createCouponSchema } from "../schemas/coupon";
import { globalSearch } from "../controllers/search";
import { searchSchema } from "../schemas/search";
import { uploadImageMiddleware, uploadMedia } from "../controllers/media";
import { getDailyReport } from '../controllers/admin';

const router = Router();

// Ops Routes
router.get('/vendors/nearby', getNearbyVendors);
router.get('/products', getProducts);
router.patch('/vendors/:vendorId/status', toggleVendorStatus);
router.post('/products/:productId/toggle-stock', toggleProductStock);
router.post('/orders/:orderId/advance', advanceOrderStatus);
router.post('/orders/place', validateRequest(placeOrderSchema), placeOrder);
router.get('/orders/:orderId/whatsapp-link', getOrderWhatsAppLink);

// Dispatch Routes
router.post('/dispatch/offer', dispatchToNearestRider);

// Admin Routes
router.get('/admin/daily-report', getDailyReport);

export default router;
// Auth Routes
router.post('/auth/otp/request', validateRequest(requestOtpSchema), requestOtp);
router.post('/auth/otp/verify', validateRequest(verifyOtpSchema), verifyOtp);
// Search Route
router.get('/search', validateRequest(searchSchema), globalSearch);
// User Routes
router.post('/users/addresses', validateRequest(addAddressSchema), addAddress);
router.delete('/users/addresses/:addressId', deleteAddress);
// Coupon Routes
router.post('/coupons', validateRequest(createCouponSchema), createCoupon);
// Media Routes
router.post('/upload', uploadImageMiddleware, uploadMedia);
// Studio Routes
router.get('/studio/collections', getCollections);
router.get('/studio/collections/:slug', getCollectionBySlug);
router.get('/studio/freshness', getFreshness);
router.get('/studio/home', getStudioHome);
router.post('/studio/collections', validateRequest(createCollectionSchema), createCollection);
router.post('/studio/freshness', validateRequest(updateFreshnessSchema), updateFreshness);
