import { Router } from 'express';
import { getNearbyVendors, toggleProductStock, advanceOrderStatus, placeOrder, getOrderWhatsAppLink, toggleVendorStatus } from '../controllers/ops';
import { validateRequest } from "../middlewares/validateRequest";
import { placeOrderSchema } from "../schemas/order";
import { dispatchToNearestRider } from '../controllers/dispatch';
import { requestOtp, verifyOtp } from "../controllers/auth";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middlewares/auth";
import { requestOtpSchema, verifyOtpSchema } from "../schemas/auth";
import { getDailyReport } from '../controllers/admin';

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { error: 'Too many OTP requests from this IP, please try again later' }
});


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


// Auth Routes
router.post('/auth/otp/request', otpLimiter, validateRequest(requestOtpSchema), requestOtp);
router.post('/auth/otp/verify', validateRequest(verifyOtpSchema), verifyOtp);

export default router;
