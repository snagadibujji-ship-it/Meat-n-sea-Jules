import mongoose, { Schema, Document } from 'mongoose';

import Order from './Order';

export interface IUser extends Document {
  phone: string;
  isPhoneVerified: boolean; // Zero-cost identity protection
  role: 'customer' | 'vendor' | 'partner' | 'admin';
  activeOrdersCount: number;
  maxActiveOrders: number; // Configurable limit to prevent prank floods
  createdAt: Date;
  updatedAt: Date;
  canPlaceOrder: () => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    isPhoneVerified: { type: Boolean, default: false }, // Manual/DB-check MVP bypasses paid OTP
    role: { type: String, enum: ['customer', 'vendor', 'partner', 'admin'], default: 'customer' },
    activeOrdersCount: { type: Number, default: 0 },
    maxActiveOrders: { type: Number, default: 5 }, // Default limit is 5
  },
  { timestamps: true }
);

// Method to verify if user can place a new order dynamically querying active statuses
UserSchema.methods.canPlaceOrder = async function (): Promise<boolean> {
  if (!this.isPhoneVerified) return false;

  const activeCount = await Order.countDocuments({
    customerId: this._id,
    currentStatus: { $in: ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery'] }
  });

  return activeCount < this.maxActiveOrders;
};

export default mongoose.model<IUser>('User', UserSchema);
