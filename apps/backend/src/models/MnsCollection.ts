import mongoose, { Schema, Document } from 'mongoose';

export interface IMnsCollection extends Document {
  title: string;
  subtitle?: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MnsCollectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

export default mongoose.model<IMnsCollection>('MnsCollection', MnsCollectionSchema);
