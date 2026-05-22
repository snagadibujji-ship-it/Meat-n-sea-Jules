import { Router } from 'express';
import { getNearbyVendors, getProducts, toggleProductStock, advanceOrderStatus, placeOrder, completeOrderDelivery, getOrderWhatsAppLink, toggleVendorStatus } from '../controllers/ops';
import { validateRequest } from "../middlewares/validateRequest";
import { placeOrderSchema, completeDeliverySchema, advanceOrderStatusSchema } from "../schemas/order";
import { toggleVendorStatusSchema } from "../schemas/vendor";
import { dispatchToNearestRider } from '../controllers/dispatch';
import { logEvent, getAnalyticsSummary } from "../controllers/analytics";
import { createEventSchema } from "../schemas/analytics";
import { getPlans, createSubscription, getMySubscription, updateSubscriptionStatus, createPlan } from "../controllers/subscription";
import { createPlanSchema, createSubscriptionSchema, updateSubscriptionSchema } from "../schemas/subscription";
import { addAddress, deleteAddress } from "../controllers/user";
import { addAddressSchema } from "../schemas/user";
import { uploadImageMiddleware, uploadMedia } from "../controllers/media";
import { getCollections, getCollectionBySlug, getFreshness, getStudioHome, createCollection, updateFreshness } from "../controllers/studio";
import { createCollectionSchema, updateFreshnessSchema } from "../schemas/studio";
import { createCoupon } from "../controllers/coupon";
import { createCouponSchema } from "../schemas/coupon";
import { globalSearch } from "../controllers/search";
import { searchSchema } from "../schemas/search";
import { getDailyReport } from '../controllers/admin';
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middlewares/auth";
import { requestOtp, verifyOtp } from "../controllers/auth";
import { requestOtpSchema, verifyOtpSchema } from "../schemas/auth";

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { error: 'Too many OTP requests from this IP, please try again later' }
});

const router = Router();

// Auth Routes
router.post('/auth/otp/request', otpLimiter, validateRequest(requestOtpSchema), requestOtp);
router.post('/auth/otp/verify', validateRequest(verifyOtpSchema), verifyOtp);

// Ops Routes
router.get('/vendors/nearby', getNearbyVendors);
router.get('/products', getProducts);
router.patch('/vendors/:vendorId/status', validateRequest(toggleVendorStatusSchema), toggleVendorStatus);
router.post('/products/:productId/toggle-stock', toggleProductStock);
router.post('/orders/:orderId/advance', validateRequest(advanceOrderStatusSchema), advanceOrderStatus);
router.post('/orders/place', requireAuth, validateRequest(placeOrderSchema), placeOrder);
router.post('/orders/:orderId/complete', validateRequest(completeDeliverySchema), completeOrderDelivery);
router.get('/orders/:orderId/whatsapp-link', getOrderWhatsAppLink);

// Dispatch Routes
router.post('/dispatch/offer', dispatchToNearestRider);

// Admin Routes
router.get('/admin/daily-report', getDailyReport);

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

// Subscription Routes
router.get('/studio/plans', getPlans);
router.post('/studio/plans', validateRequest(createPlanSchema), createPlan);
router.post('/studio/subscriptions', validateRequest(createSubscriptionSchema), createSubscription);
router.get('/studio/subscriptions/me', getMySubscription);
router.patch('/studio/subscriptions/:id', validateRequest(updateSubscriptionSchema), updateSubscriptionStatus);

// Analytics Routes
router.post('/analytics/event', validateRequest(createEventSchema), logEvent);
router.get('/analytics/summary', getAnalyticsSummary);

export default router;
