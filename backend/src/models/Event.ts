import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  category: string;
  priority: string;
  status: string;
  userId: mongoose.Types.ObjectId;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true, default: 'upcoming' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);
