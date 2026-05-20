import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from './Order';

export interface ILedger extends Document {
  orderId: mongoose.Types.ObjectId;
  totalAmountPaise: number;
  paymentMethod: 'cod' | 'online';
  cashCollectedBy: 'platform' | 'rider';
  createdAt: Date;
  updatedAt: Date;
}

const LedgerSchema: Schema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    totalAmountPaise: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
    cashCollectedBy: { type: String, enum: ['platform', 'rider'], required: true, default: 'platform' },
  },
  { timestamps: true }
);

// Pre-validate hook: critical edge-case patch from Codex to force cashCollectedBy = 'rider' if COD
LedgerSchema.pre('validate', function (next) {
  if (this.paymentMethod === 'cod') {
    this.cashCollectedBy = 'rider';
  }
  next();
});

export default mongoose.model<ILedger>('Ledger', LedgerSchema);
