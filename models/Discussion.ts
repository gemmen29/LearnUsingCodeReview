import mongoose, { Schema, Model } from 'mongoose';
import type { Discussion } from '@/types';

const DiscussionSchema = new Schema<Discussion>({
  reviewId: { type: String, required: true },
  commentId: String,
  userId: { type: String, required: true },
  content: { type: String, required: true },
  parentId: String,
  createdAt: { type: Date, default: Date.now },
});

const DiscussionModel: Model<Discussion> = 
  mongoose.models.Discussion || mongoose.model<Discussion>('Discussion', DiscussionSchema);

export default DiscussionModel;
