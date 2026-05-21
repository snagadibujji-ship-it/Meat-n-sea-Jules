import { Request, Response } from 'express';
import AppEvent from '../models/AppEvent';

export const logEvent = async (req: Request, res: Response) => {
  try {
    const { eventName, metaData } = req.body;
    const userId = (req as any).user?.id || req.body.userId;

    const event = await AppEvent.create({
      userId,
      eventName,
      metaData
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAnalyticsSummary = async (req: Request, res: Response) => {
  try {
    // Simple aggregate for mode switches
    const modeSwitches = await AppEvent.countDocuments({ eventName: 'mode_switched' });
    const studioViews = await AppEvent.countDocuments({ eventName: 'studio_home_viewed' });

    // In a real app we'd do complex aggregations here based on metaData
    res.json({
        totalSwitches: modeSwitches,
        studioViews: studioViews,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
