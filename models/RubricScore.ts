import mongoose, { Schema, Model } from 'mongoose';
import type { RubricScore } from '@/types';

const RubricScoreSchema = new Schema<RubricScore>({
  reviewId: { type: String, required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  feedback: String,
});

const RubricScoreModel: Model<RubricScore> = 
  mongoose.models.RubricScore || mongoose.model<RubricScore>('RubricScore', RubricScoreSchema);

export default RubricScoreModel;
