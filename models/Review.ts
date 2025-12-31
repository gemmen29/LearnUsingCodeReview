import mongoose, { Schema, Model } from 'mongoose';
import type { Review } from '@/types';

const ReviewSchema = new Schema<Review>({
  repositoryId: { type: String, required: true },
  reviewerId: { type: String, required: true },
  commitSha: { type: String, required: true },
  status: { type: String, enum: ['draft', 'submitted', 'completed'], default: 'draft' },
  score: Number,
  createdAt: { type: Date, default: Date.now },
  submittedAt: Date,
});

const ReviewModel: Model<Review> = 
  mongoose.models.Review || mongoose.model<Review>('Review', ReviewSchema);

export default ReviewModel;
