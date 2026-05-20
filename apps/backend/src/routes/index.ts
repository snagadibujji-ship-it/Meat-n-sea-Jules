import { Router } from 'express';
import { getNearbyVendors, toggleProductStock, advanceOrderStatus, placeOrder, getOrderWhatsAppLink } from '../controllers/ops';
import { dispatchToNearestRider } from '../controllers/dispatch';
import { getDailyReport } from '../controllers/admin';

const router = Router();

// Ops Routes
router.get('/vendors/nearby', getNearbyVendors);
router.post('/products/:productId/toggle-stock', toggleProductStock);
router.post('/orders/:orderId/advance', advanceOrderStatus);
router.post('/orders/place', placeOrder);
router.get('/orders/:orderId/whatsapp-link', getOrderWhatsAppLink);

// Dispatch Routes
router.post('/dispatch/offer', dispatchToNearestRider);

// Admin Routes
router.get('/admin/daily-report', getDailyReport);

export default router;
