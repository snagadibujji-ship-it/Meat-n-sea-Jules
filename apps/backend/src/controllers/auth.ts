import { Request, Response } from 'express';
import Otp from '../models/Otp';
import User from '../models/User';

// Generate OTP (simulated via 6 digits)
export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // In a real app, generate a random 6-digit code. Here we hardcode for demo or use random
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({
      phone,
      code,
      expiresAt,
    });

    // TODO: Integrate SMS gateway here

    res.json({ message: 'OTP sent successfully', code }); // Sending code for dev/test purposes
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and code are required' });
    }

    // Find the latest unused OTP for this phone
    const otpRecord = await Otp.findOne({
      phone,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() } // Must not be expired
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Check if user exists, if not create
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    // TODO: Generate JWT token here

    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
