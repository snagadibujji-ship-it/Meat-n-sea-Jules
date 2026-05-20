import { Router } from 'express';
import { getNearbyVendors, toggleProductStock, advanceOrderStatus, placeOrder } from '../controllers/ops';
import { dispatchToNearestRider } from '../controllers/dispatch';

const router = Router();

// Ops Routes
router.get('/vendors/nearby', getNearbyVendors);
router.post('/products/:productId/toggle-stock', toggleProductStock);
router.post('/orders/:orderId/advance', advanceOrderStatus);
router.post('/orders/place', placeOrder);

// Dispatch Routes
router.post('/dispatch/offer', dispatchToNearestRider);

export default router;
