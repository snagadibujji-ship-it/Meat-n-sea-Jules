import { redisSubscriber } from '../utils/redis';
import Order from '../models/Order';

export const startRedisCleanupListener = () => {
  // Listen for keyspace notifications
  // The channel format for expiration events is: __keyevent@<db>__:expired
  redisSubscriber.subscribe('__keyevent@0__:expired', (err) => {
    if (err) {
      console.error('Failed to subscribe to Redis expired events:', err);
    } else {
      console.log('Subscribed to Redis expired keyspace events.');
    }
  });

  redisSubscriber.on('message', async (channel, key) => {
    // Only process our dispatch keys
    if (key.startsWith('dispatch:')) {
      const orderId = key.split(':')[1];
      console.log(`Dispatch offer expired for Order ${orderId}`);

      try {
        // Highly optimized $unset atomic operation avoids network roundtrips
        // and race conditions inherent in findById -> save.
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { $unset: { offeredRiderId: 1 } },
          { new: true }
        );

        if (updatedOrder) {
            // Real system trigger: io.emit('dispatch:expired', { orderId });
            console.log(`Successfully cleaned up expired dispatch offer from DB for Order ${orderId}`);
        }
      } catch (err) {
        console.error('Failed to cleanup expired order Mongoose doc:', orderId, err);
      }
    }
  });
};
