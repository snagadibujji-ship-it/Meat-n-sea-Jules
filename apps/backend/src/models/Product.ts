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

// Pre-findOneAndUpdate hook: catch updates that modify stockQuantity
ProductSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<IProduct>;

  if (update && update.$set && update.$set.stockQuantity !== undefined) {
    if (update.$set.stockQuantity <= 0) {
      update.$set.isOutOfStock = true;
    } else {
      update.$set.isOutOfStock = false;
    }
  } else if (update && update.stockQuantity !== undefined) {
      if ((update as any).stockQuantity <= 0) {
          (update as any).isOutOfStock = true;
      } else {
          (update as any).isOutOfStock = false;
      }
  }
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
