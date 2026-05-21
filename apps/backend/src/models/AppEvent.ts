import mongoose, { Schema, Document } from 'mongoose';

export interface IAppEvent extends Document {
  userId?: mongoose.Types.ObjectId;
  eventName: string;
  metaData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AppEventSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    eventName: { type: String, required: true, index: true },
    metaData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IAppEvent>('AppEvent', AppEventSchema);
