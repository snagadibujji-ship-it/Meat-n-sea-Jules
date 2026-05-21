import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  description?: string;
  phone: string;
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  isOpen: boolean;
  status: 'open' | 'busy' | 'closed';
  serviceRadiusKm: number;
  fssaiNumber?: string;
  businessHours?: {
    openTime: string;
    closeTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    phone: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    isOpen: { type: Boolean, default: true },
    status: { type: String, enum: ['open', 'busy', 'closed'], default: 'open' },
    serviceRadiusKm: { type: Number, default: 5 }, // Default radius for delivery
    fssaiNumber: { type: String },
    businessHours: {
      openTime: { type: String },
      closeTime: { type: String },
    },
  },
  { timestamps: true }
);

// MongoDB Native 2dsphere index for zero-cost native Geo-Math aggregations
VendorSchema.index({ location: '2dsphere' });

VendorSchema.index({ name: 'text', description: 'text' });
export default mongoose.model<IVendor>('Vendor', VendorSchema);
