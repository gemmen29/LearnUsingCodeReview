import mongoose, { Schema, Model } from 'mongoose';
import type { Repository } from '@/types';

const RepositorySchema = new Schema<Repository>({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  githubUrl: { type: String, required: true },
  importedBy: { type: String, required: true },
  defaultBranch: { type: String, default: 'main' },
  createdAt: { type: Date, default: Date.now },
});

const RepositoryModel: Model<Repository> = 
  mongoose.models.Repository || mongoose.model<Repository>('Repository', RepositorySchema);

export default RepositoryModel;
