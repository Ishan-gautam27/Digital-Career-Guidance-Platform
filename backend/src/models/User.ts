import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'professional' | 'admin';
  profileComplete: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for potential OAuth
  role: { type: String, enum: ['student', 'professional', 'admin'], default: 'student' },
  profileComplete: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
