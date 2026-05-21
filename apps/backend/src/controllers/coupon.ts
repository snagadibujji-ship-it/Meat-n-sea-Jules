import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discountPercentage, maxDiscountPaise, expiresAt } = req.body;

    const coupon = await Coupon.create({
      code,
      discountPercentage,
      maxDiscountPaise,
      expiresAt: new Date(expiresAt)
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
