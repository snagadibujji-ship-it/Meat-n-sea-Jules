import { Router } from 'express';
import { getNearbyVendors, toggleProductStock, advanceOrderStatus, placeOrder, getOrderWhatsAppLink, toggleVendorStatus } from '../controllers/ops';
import { validateRequest } from "../middlewares/validateRequest";
import { placeOrderSchema, advanceOrderStatusSchema } from "../schemas/order";
import { toggleVendorStatusSchema } from "../schemas/vendor";
import { dispatchToNearestRider } from '../controllers/dispatch';
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
router.patch('/vendors/:vendorId/status', validateRequest(toggleVendorStatusSchema), toggleVendorStatus);
router.post('/products/:productId/toggle-stock', toggleProductStock);
router.post('/orders/:orderId/advance', validateRequest(advanceOrderStatusSchema), advanceOrderStatus);
router.post('/orders/place', requireAuth, validateRequest(placeOrderSchema), placeOrder);
router.get('/orders/:orderId/whatsapp-link', getOrderWhatsAppLink);

// Dispatch Routes
router.post('/dispatch/offer', dispatchToNearestRider);

// Admin Routes
router.get('/admin/daily-report', getDailyReport);

export default router;
