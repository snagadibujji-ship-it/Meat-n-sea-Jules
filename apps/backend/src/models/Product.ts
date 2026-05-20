import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  pricePaise: number; // Stored in integer paise to avoid float errors
  stockQuantity: number;
  isOutOfStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    pricePaise: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    isOutOfStock: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Pre-save hook: automatically toggle isOutOfStock if quantity reaches 0
ProductSchema.pre('save', function (this: IProduct, next: (err?: mongoose.CallbackError) => void) {
  if (this.stockQuantity <= 0) {
    this.isOutOfStock = true;
  }
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
