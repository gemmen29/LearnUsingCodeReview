import mongoose, { Schema, Model } from 'mongoose';
import type { Progress } from '@/types';

const ProgressSchema = new Schema<Progress>({
  userId: { type: String, required: true, unique: true },
  reviewsCompleted: { type: Number, default: 0 },
  commentsCreated: { type: Number, default: 0 },
  categoryCounts: {
    bug: { type: Number, default: 0 },
    performance: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
  },
  averageScore: { type: Number, default: 0 },
  lastActivityAt: { type: Date, default: Date.now },
});

const ProgressModel: Model<Progress> = 
  mongoose.models.Progress || mongoose.model<Progress>('Progress', ProgressSchema);

export default ProgressModel;
