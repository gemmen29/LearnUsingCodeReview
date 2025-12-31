import mongoose, { Schema, Model } from 'mongoose';
import type { ChecklistItem } from '@/types';

const ChecklistItemSchema = new Schema<ChecklistItem>({
  reviewId: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  order: { type: Number, required: true },
});

const ChecklistItemModel: Model<ChecklistItem> = 
  mongoose.models.ChecklistItem || mongoose.model<ChecklistItem>('ChecklistItem', ChecklistItemSchema);

export default ChecklistItemModel;
