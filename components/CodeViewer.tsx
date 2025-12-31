import React from 'react';
import { Comment, CommentCategory } from '@/types';

interface CodeViewerProps {
  file: {
    filename: string;
    patch?: string;
    additions: number;
    deletions: number;
  };
  comments: Comment[];
  onAddComment?: (lineNumber: number, category: CommentCategory, content: string) => void;
}

const categoryColors: Record<CommentCategory, string> = {
  bug: 'bg-red-100 border-red-400 text-red-800',
  performance: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  security: 'bg-orange-100 border-orange-400 text-orange-800',
  readability: 'bg-blue-100 border-blue-400 text-blue-800',
};

export default function CodeViewer({ file, comments, onAddComment }: CodeViewerProps) {
  const [selectedLine, setSelectedLine] = React.useState<number | null>(null);
  const [commentCategory, setCommentCategory] = React.useState<CommentCategory>('bug');
  const [commentContent, setCommentContent] = React.useState('');

  const lines = file.patch?.split('\n') || [];

  const handleAddComment = () => {
    if (selectedLine !== null && commentContent.trim() && onAddComment) {
      onAddComment(selectedLine, commentCategory, commentContent);
      setSelectedLine(null);
      setCommentContent('');
    }
  };

  const getLineComments = (lineNum: number) => {
    return comments.filter(c => c.lineNumber === lineNum);
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm">{file.filename}</span>
          <div className="text-sm">
            <span className="text-green-600">+{file.additions}</span>
            {' '}
            <span className="text-red-600">-{file.deletions}</span>
          </div>
        </div>
      </div>

      <div className="bg-white">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const lineComments = getLineComments(lineNum);
          const isSelected = selectedLine === lineNum;

          return (
            <div key={idx} className="group">
              <div
                className={`flex hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedLine(isSelected ? null : lineNum)}
              >
                <div className="w-12 text-right px-2 py-1 text-gray-500 text-xs select-none border-r">
                  {lineNum}
                </div>
                <div className="flex-1 px-4 py-1 font-mono text-sm whitespace-pre overflow-x-auto">
                  {line}
                </div>
              </div>

              {lineComments.length > 0 && (
                <div className="ml-12 mr-4 mb-2">
                  {lineComments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`border-l-4 p-3 mb-2 ${categoryColors[comment.category]}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase">
                          {comment.category}
                        </span>
                        <span className="text-xs opacity-75">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm">{comment.content}</div>
                    </div>
                  ))}
                </div>
              )}

              {isSelected && onAddComment && (
                <div className="ml-12 mr-4 mb-2 p-4 bg-gray-50 border rounded">
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={commentCategory}
                      onChange={(e) => setCommentCategory(e.target.value as CommentCategory)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="bug">Bug</option>
                      <option value="performance">Performance</option>
                      <option value="security">Security</option>
                      <option value="readability">Readability</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Comment</label>
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Add your review comment..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Add Comment
                    </button>
                    <button
                      onClick={() => setSelectedLine(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
