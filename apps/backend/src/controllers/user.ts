import { Request, Response } from 'express';
import User from '../models/User';

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId; // fallback for demo
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { label, streetAddress, lat, lng } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.savedAddresses) {
      user.savedAddresses = [];
    }

    user.savedAddresses.push({
      label,
      streetAddress,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });

    await user.save();
    res.json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.savedAddresses = user.savedAddresses?.filter(a => a._id?.toString() !== addressId);
    await user.save();

    res.json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
