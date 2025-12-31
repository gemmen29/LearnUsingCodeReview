'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Repository } from '@/types';

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export default function RepoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, resolvedParams.id]);

  const fetchData = async () => {
    try {
      // Fetch repo details
      const repoRes = await fetch('/api/repos');
      if (repoRes.ok) {
        const repos = await repoRes.json();
        const foundRepo = repos.find((r: Repository) => r._id === resolvedParams.id);
        if (foundRepo) {
          setRepo(foundRepo);

          // Fetch commits
          const commitsRes = await fetch(
            `/api/repos/${resolvedParams.id}/commits?owner=${foundRepo.owner}&repo=${foundRepo.name}`
          );
          if (commitsRes.ok) {
            setCommits(await commitsRes.json());
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = async (commitSha: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryId: resolvedParams.id, commitSha }),
      });

      if (res.ok) {
        const review = await res.json();
        window.location.href = `/review/${review._id}`;
      }
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Repository not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {repo.owner}/{repo.name}
          </h1>
          <a
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View on GitHub →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Commits</h2>

          {commits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No commits found</div>
          ) : (
            <div className="space-y-4">
              {commits.map((commit) => (
                <div key={commit.sha} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-sm text-gray-600 mb-1">
                        {commit.sha.slice(0, 7)}
                      </div>
                      <div className="font-semibold mb-1">{commit.commit.message}</div>
                      <div className="text-sm text-gray-600">
                        {commit.commit.author.name} •{' '}
                        {new Date(commit.commit.author.date).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartReview(commit.sha)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4"
                    >
                      Start Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
