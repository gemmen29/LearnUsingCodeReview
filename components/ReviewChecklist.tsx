import React from 'react';
import { ChecklistItem } from '@/types';

interface ReviewChecklistProps {
  reviewId: string;
  items?: ChecklistItem[];
  onUpdate?: (items: ChecklistItem[]) => void;
}

const defaultItems = [
  'Code follows project style guidelines',
  'No obvious bugs or logical errors',
  'Functions are properly documented',
  'Error handling is implemented',
  'No security vulnerabilities identified',
  'Code is readable and maintainable',
  'Tests are included or updated',
  'Performance considerations addressed',
];

export default function ReviewChecklist({ reviewId, items, onUpdate }: ReviewChecklistProps) {
  const [checklist, setChecklist] = React.useState<ChecklistItem[]>(
    items ||
      defaultItems.map((desc, idx) => ({
        _id: '',
        reviewId,
        description: desc,
        completed: false,
        order: idx,
      }))
  );

  const handleToggle = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);
    onUpdate?.(newChecklist);
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Review Checklist</h2>
        <div className="text-sm font-semibold">
          {completedCount} / {totalCount} ({percentage}%)
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(idx)}
              className="mt-1 w-5 h-5 cursor-pointer"
            />
            <label
              className={`flex-1 cursor-pointer ${
                item.completed ? 'line-through text-gray-500' : ''
              }`}
              onClick={() => handleToggle(idx)}
            >
              {item.description}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
