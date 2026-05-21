import { Request, Response } from 'express';
import StudioPlan from '../models/StudioPlan';
import StudioSubscription from '../models/StudioSubscription';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await StudioPlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId; // fallback
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { planId, deliveryDay, deliveryAddress, nextDeliveryAt } = req.body;

    const plan = await StudioPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ error: 'Invalid or inactive plan' });
    }

    const sub = await StudioSubscription.create({
      userId,
      planId,
      deliveryDay,
      deliveryAddress,
      nextDeliveryAt: new Date(nextDeliveryAt),
      status: 'active'
    });

    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMySubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const subs = await StudioSubscription.find({ userId }).populate('planId');
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'paused', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const sub = await StudioSubscription.findByIdAndUpdate(id, { status }, { new: true });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createPlan = async (req: Request, res: Response) => {
    try {
        const { name, description, pricePaise, intervalDays, curatedItems } = req.body;
        const plan = await StudioPlan.create({ name, description, pricePaise, intervalDays, curatedItems });
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
