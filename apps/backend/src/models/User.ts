import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  isPhoneVerified: boolean; // Zero-cost identity protection
  role: 'customer' | 'vendor' | 'partner' | 'admin';
  activeOrdersCount: number;
  maxActiveOrders: number; // Configurable limit to prevent prank floods
  createdAt: Date;
  updatedAt: Date;
  canPlaceOrder: () => boolean;
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

// Method to verify if user can place a new order
UserSchema.methods.canPlaceOrder = function (): boolean {
  return this.isPhoneVerified && this.activeOrdersCount < this.maxActiveOrders;
};

export default mongoose.model<IUser>('User', UserSchema);
