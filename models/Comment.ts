import mongoose, { Schema, Model } from 'mongoose';
import type { Comment } from '@/types';

const CommentSchema = new Schema<Comment>({
  reviewId: { type: String, required: true },
  userId: { type: String, required: true },
  filePath: { type: String, required: true },
  lineNumber: { type: Number, required: true },
  category: { type: String, enum: ['bug', 'performance', 'security', 'readability'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentModel: Model<Comment> = 
  mongoose.models.Comment || mongoose.model<Comment>('Comment', CommentSchema);

export default CommentModel;
