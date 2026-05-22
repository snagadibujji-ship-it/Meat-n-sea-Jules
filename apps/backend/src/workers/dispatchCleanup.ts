import Order from '../models/Order';
import { getIO } from '../socket';
import { redisClient } from '../utils/redis';

// Polling worker to scan for and reassign pending dispatch offers (Fallback for Upstash limitations)
export const startDispatchPollWorker = () => {
    setInterval(async () => {
        try {
            // Find all pending orders that have an offeredRiderId
            const pendingOrders = await Order.find({
                currentStatus: 'pending',
                offeredRiderId: { $exists: true }
            });

            for (const order of pendingOrders) {
                const redisKey = `dispatch:offer:${order._id.toString()}`;
                const activeOffer = await redisClient.get(redisKey);

                if (!activeOffer) {
                    // Redis TTL expired, the key is gone.
                    order.offeredRiderId = undefined;
                    await order.save();
                    console.log(`[DISPATCH] Order ${order._id} offer expired. Unlocked for re-dispatch.`);
                }
            }
        } catch (err) {
            console.error('[DISPATCH ERROR] Failed to poll for expired offers:', err);
        }
    }, 30000); // Check every 30 seconds

    console.log('Dispatch Expired Offers Polling Worker started (30s interval).');
};

// Phase 5: SLA Breach Monitor
export const checkSlaBreaches = async () => {
    try {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

        const breachedOrders = await Order.find({
            sourceMode: 'studio',
            currentStatus: 'pending',
            createdAt: { $lt: fiveMinsAgo }
        });

        if (breachedOrders.length > 0) {
            console.warn(`[SLA BREACH] Found ${breachedOrders.length} unassigned Studio orders!`);

            const io = getIO();
            io.to('admin').emit('sla_breach', { count: breachedOrders.length, orders: breachedOrders.map(o => o._id) });
        }
    } catch (err) {
        console.error('Error checking SLA breaches:', err);
    }
}
