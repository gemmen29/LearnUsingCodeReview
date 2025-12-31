'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ProgressDashboard from '@/components/ProgressDashboard';
import type { Repository, Review, Progress } from '@/types';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importOwner, setImportOwner] = useState('');
  const [importRepo, setImportRepo] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [reposRes, reviewsRes, progressRes] = await Promise.all([
        fetch('/api/repos'),
        fetch('/api/reviews'),
        fetch('/api/progress'),
      ]);

      if (reposRes.ok) setRepos(await reposRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (progressRes.ok) setProgress(await progressRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importOwner || !importRepo) return;

    try {
      const res = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: importOwner, repo: importRepo }),
      });

      if (res.ok) {
        setShowImportModal(false);
        setImportOwner('');
        setImportRepo('');
        fetchData();
      }
    } catch (error) {
      console.error('Error importing repository:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Link href="/api/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Code Review Platform
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.name || session?.user?.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {progress && <ProgressDashboard progress={progress} />}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Repositories</h2>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Import Repository
            </button>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No repositories yet. Import one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {repos.map((repo) => (
                <div key={repo._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {repo.owner}/{repo.name}
                      </h3>
                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View on GitHub
                      </a>
                    </div>
                    <Link
                      href={`/repo/${repo._id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Start Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Start your first review!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{review.commitSha.slice(0, 7)}</div>
                      <div className="text-sm text-gray-600">
                        Status: <span className="capitalize">{review.status}</span>
                        {review.score && <span> • Score: {review.score}%</span>}
                      </div>
                    </div>
                    <Link
                      href={`/review/${review._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Import Repository</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input
                  type="text"
                  value={importOwner}
                  onChange={(e) => setImportOwner(e.target.value)}
                  placeholder="e.g., facebook"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Repository</label>
                <input
                  type="text"
                  value={importRepo}
                  onChange={(e) => setImportRepo(e.target.value)}
                  placeholder="e.g., react"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleImport}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Import
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
