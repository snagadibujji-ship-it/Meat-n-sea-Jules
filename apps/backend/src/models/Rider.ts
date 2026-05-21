import mongoose, { Schema, Document } from 'mongoose';

export interface IRider extends Document {
  userId: mongoose.Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  isOnline: boolean;
  status: 'available' | 'delivering' | 'offline';
  lastPing: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RiderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    isOnline: { type: Boolean, default: false },
    status: { type: String, enum: ['available', 'delivering', 'offline'], default: 'offline' },
    lastPing: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// MongoDB Native 2dsphere index for zero-cost routing dispatching
RiderSchema.index({ location: '2dsphere' });

export default mongoose.model<IRider>('Rider', RiderSchema);
