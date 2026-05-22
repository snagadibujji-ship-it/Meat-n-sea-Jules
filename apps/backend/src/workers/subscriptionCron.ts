import mongoose from 'mongoose';
import StudioSubscription from '../models/StudioSubscription';
import StudioPlan from '../models/StudioPlan';
import Order from '../models/Order';
import Ledger from '../models/Ledger';

export const processSubscriptions = async () => {
  console.log('Running Subscription Cron...');
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  try {
    const dueSubscriptions = await StudioSubscription.find({
      status: 'active',
      nextDeliveryAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('planId');

    console.log(`Found ${dueSubscriptions.length} subscriptions due today.`);

    for (const sub of dueSubscriptions) {
      const plan = sub.planId as any; // Type override since populated
      if (!plan) continue;

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const Vendor = mongoose.model('Vendor');
        const studioVendor = await Vendor.findOne({ isMnsStudio: true }).session(session);

        if (!studioVendor) {
            console.error('No Studio Vendor found to process subscription!');
            throw new Error('No Studio Vendor found');
        }

        const order = await Order.create([{
            customerId: sub.userId,
            vendorId: studioVendor._id,
            totalAmountPaise: plan.pricePaise,
            paymentMethod: 'online',
            sourceMode: 'studio',
            deliveryTier: 'priority',
            customerNote: `Studio Box: ${plan.name}`,
        }], { session });

        const platformFeePaise = Math.floor((plan.pricePaise * 10) / 100);

        await Ledger.create([{
            orderId: order[0]._id,
            totalAmountPaise: plan.pricePaise,
            paymentMethod: 'online',
            platformFeePaise,
            discountPaise: 0,
        }], { session });

        const nextDate = new Date(sub.nextDeliveryAt);
        nextDate.setDate(nextDate.getDate() + plan.intervalDays);
        sub.nextDeliveryAt = nextDate;
        await sub.save({ session });

        await session.commitTransaction();
        console.log(`Successfully generated order ${order[0]._id} for subscription ${sub._id}`);

      } catch (err) {
        await session.abortTransaction();
        console.error(`Failed to process subscription ${sub._id}:`, err);
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error('Subscription Cron Error:', error);
  }
};
