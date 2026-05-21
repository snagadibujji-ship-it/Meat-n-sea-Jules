import mongoose, { Schema, Document } from 'mongoose';

export interface IStudioFreshness extends Document {
  catchTime: Date;
  harbourArrivalTime: Date;
  processedTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudioFreshnessSchema: Schema = new Schema(
  {
    catchTime: { type: Date, required: true },
    harbourArrivalTime: { type: Date, required: true },
    processedTime: { type: Date, required: true },
  },
  { timestamps: true }
);

// Optional: you can add a pre-save to mark older records as inactive if we wanted a historical ledger,
// but for now the prompt says "Only the latest record should be active." We'll just fetch sorting by date desc.

export default mongoose.model<IStudioFreshness>('StudioFreshness', StudioFreshnessSchema);
