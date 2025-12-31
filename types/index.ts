export type CommentCategory = 'bug' | 'performance' | 'security' | 'readability';

export type UserRole = 'learner' | 'mentor' | 'admin';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  githubUsername?: string;
  createdAt: Date;
}

export interface Repository {
  _id: string;
  name: string;
  owner: string;
  githubUrl: string;
  importedBy: string;
  createdAt: Date;
  defaultBranch: string;
}

export interface Review {
  _id: string;
  repositoryId: string;
  reviewerId: string;
  commitSha: string;
  status: 'draft' | 'submitted' | 'completed';
  score?: number;
  createdAt: Date;
  submittedAt?: Date;
}

export interface Comment {
  _id: string;
  reviewId: string;
  userId: string;
  filePath: string;
  lineNumber: number;
  category: CommentCategory;
  content: string;
  createdAt: Date;
}

export interface ChecklistItem {
  _id: string;
  reviewId: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface RubricScore {
  _id: string;
  reviewId: string;
  category: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

export interface Discussion {
  _id: string;
  reviewId: string;
  commentId?: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: Date;
}

export interface Progress {
  _id: string;
  userId: string;
  reviewsCompleted: number;
  commentsCreated: number;
  categoryCounts: Record<CommentCategory, number>;
  averageScore: number;
  lastActivityAt: Date;
}
