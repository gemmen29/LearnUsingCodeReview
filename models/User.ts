import mongoose, { Schema, Model } from 'mongoose';
import type { User } from '@/types';

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['learner', 'mentor', 'admin'], default: 'learner' },
  githubUsername: String,
  createdAt: { type: Date, default: Date.now },
});

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
