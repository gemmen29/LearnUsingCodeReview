'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CodeViewer from '@/components/CodeViewer';
import ReviewChecklist from '@/components/ReviewChecklist';
import RubricScoring from '@/components/RubricScoring';
import type { Review, Comment, Repository, CommentCategory, RubricScore } from '@/types';

interface CommitFile {
  filename: string;
  patch?: string;
  additions: number;
  deletions: number;
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const [review, setReview] = useState<Review | null>(null);
  const [repo, setRepo] = useState<Repository | null>(null);
  const [files, setFiles] = useState<CommitFile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'checklist' | 'scoring'>('code');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, resolvedParams.id]);

  const fetchData = async () => {
    try {
      // Fetch review
      const reviewsRes = await fetch('/api/reviews');
      if (reviewsRes.ok) {
        const reviews = await reviewsRes.json();
        const foundReview = reviews.find((r: Review) => r._id === resolvedParams.id);
        if (foundReview) {
          setReview(foundReview);

          // Fetch repository
          const reposRes = await fetch('/api/repos');
          if (reposRes.ok) {
            const repos = await reposRes.json();
            const foundRepo = repos.find((r: Repository) => r._id === foundReview.repositoryId);
            if (foundRepo) {
              setRepo(foundRepo);

              // Fetch commit diff
              const diffRes = await fetch(
                `/api/repos/diff/${foundReview.commitSha}?owner=${foundRepo.owner}&repo=${foundRepo.name}`
              );
              if (diffRes.ok) {
                const commit = await diffRes.json();
                setFiles(commit.files || []);
              }
            }
          }

          // Fetch comments
          const commentsRes = await fetch(`/api/comments?reviewId=${resolvedParams.id}`);
          if (commentsRes.ok) {
            setComments(await commentsRes.json());
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (
    filePath: string,
    lineNumber: number,
    category: CommentCategory,
    content: string
  ) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: resolvedParams.id,
          filePath,
          lineNumber,
          category,
          content,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([...comments, newComment]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSaveScores = async (scores: RubricScore[]) => {
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: resolvedParams.id, scores }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Review completed! Final score: ${data.finalScore}%`);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error saving scores:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!review || !repo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Review not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
            <div className="text-sm text-gray-600">
              Status: <span className="capitalize font-semibold">{review.status}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Review</h1>
          <div className="text-gray-600">
            {repo.owner}/{repo.name} • {review.commitSha.slice(0, 7)}
          </div>
        </div>

        <div className="mb-4 border-b bg-white rounded-t-lg">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('code')}
              className={`py-4 px-2 border-b-2 font-semibold ${
                activeTab === 'code'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Code Review
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`py-4 px-2 border-b-2 font-semibold ${
                activeTab === 'checklist'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Checklist
            </button>
            <button
              onClick={() => setActiveTab('scoring')}
              className={`py-4 px-2 border-b-2 font-semibold ${
                activeTab === 'scoring'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Scoring
            </button>
          </div>
        </div>

        {activeTab === 'code' && (
          <div>
            {files.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                No files changed in this commit
              </div>
            ) : (
              files.map((file, idx) => (
                <CodeViewer
                  key={idx}
                  file={file}
                  comments={comments.filter((c) => c.filePath === file.filename)}
                  onAddComment={(lineNumber, category, content) =>
                    handleAddComment(file.filename, lineNumber, category, content)
                  }
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="max-w-4xl">
            <ReviewChecklist reviewId={resolvedParams.id} />
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="max-w-4xl">
            <RubricScoring reviewId={resolvedParams.id} onSave={handleSaveScores} />
          </div>
        )}
      </div>
    </div>
  );
}
