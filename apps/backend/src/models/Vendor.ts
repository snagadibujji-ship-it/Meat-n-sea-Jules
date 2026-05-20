import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  isOpen: boolean;
  status: 'open' | 'busy' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    isOpen: { type: Boolean, default: true },
    status: { type: String, enum: ['open', 'busy', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

// MongoDB Native 2dsphere index for zero-cost native Geo-Math aggregations
VendorSchema.index({ location: '2dsphere' });

export default mongoose.model<IVendor>('Vendor', VendorSchema);
