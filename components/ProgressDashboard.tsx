import React from 'react';
import { Progress } from '@/types';

interface ProgressDashboardProps {
  progress: Progress;
}

export default function ProgressDashboard({ progress }: ProgressDashboardProps) {
  const totalComments =
    progress.categoryCounts.bug +
    progress.categoryCounts.performance +
    progress.categoryCounts.security +
    progress.categoryCounts.readability;

  const getCategoryPercentage = (count: number) => {
    return totalComments > 0 ? Math.round((count / totalComments) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{progress.reviewsCompleted}</div>
          <div className="text-sm text-gray-600">Reviews Completed</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{progress.commentsCreated}</div>
          <div className="text-sm text-gray-600">Comments Created</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{progress.averageScore}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comment Categories</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-red-600">Bug</span>
              <span className="text-sm text-gray-600">
                {progress.categoryCounts.bug} ({getCategoryPercentage(progress.categoryCounts.bug)}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${getCategoryPercentage(progress.categoryCounts.bug)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-yellow-600">Performance</span>
              <span className="text-sm text-gray-600">
                {progress.categoryCounts.performance} (
                {getCategoryPercentage(progress.categoryCounts.performance)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: `${getCategoryPercentage(progress.categoryCounts.performance)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-orange-600">Security</span>
              <span className="text-sm text-gray-600">
                {progress.categoryCounts.security} (
                {getCategoryPercentage(progress.categoryCounts.security)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${getCategoryPercentage(progress.categoryCounts.security)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-blue-600">Readability</span>
              <span className="text-sm text-gray-600">
                {progress.categoryCounts.readability} (
                {getCategoryPercentage(progress.categoryCounts.readability)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${getCategoryPercentage(progress.categoryCounts.readability)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Last activity: {new Date(progress.lastActivityAt).toLocaleDateString()}
      </div>
    </div>
  );
}
