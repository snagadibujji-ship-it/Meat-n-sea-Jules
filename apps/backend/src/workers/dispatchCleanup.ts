import { subscriberClient } from '../utils/redis';
import Order from '../models/Order';
import { getIO } from '../socket';

export const startRedisCleanupListener = async () => {
  if (!subscriberClient.isOpen) {
    await subscriberClient.connect();
  }

  // Subscribe to Redis Keyspace Notifications for expired keys
  await subscriberClient.subscribe('__keyevent@0__:expired', async (message) => {
    // message is the key that expired, e.g., "dispatch:offer:64abc123..."
    if (message.startsWith('dispatch:offer:')) {
      const orderId = message.split(':')[2];

      try {
        const order = await Order.findById(orderId);
        if (order && order.currentStatus === 'pending') {
          // Unset the offeredRiderId so the cron/next-poll can re-dispatch it
          order.offeredRiderId = undefined;
          await order.save();
          console.log(`[DISPATCH] Order ${orderId} offer expired. Unlocked for re-dispatch.`);
        }
      } catch (err) {
        console.error(`[DISPATCH ERROR] Failed to clean up order ${orderId}:`, err);
      }
    }
  });

  console.log('Redis Keyspace Expire Listener started.');
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
            // Emit to an admin room or just globally if we have a dedicated admin socket channel
            // Ensure you have `socket.join('admin')` in your socket setup for admin clients
            io.to('admin').emit('sla_breach', { count: breachedOrders.length, orders: breachedOrders.map(o => o._id) });
        }
    } catch (err) {
        console.error('Error checking SLA breaches:', err);
    }
}
