import React from 'react';
import { RubricScore } from '@/types';

interface RubricScoringProps {
  reviewId: string;
  onSave?: (scores: RubricScore[]) => void;
}

const defaultCategories = [
  { name: 'Code Quality', maxScore: 25 },
  { name: 'Best Practices', maxScore: 25 },
  { name: 'Documentation', maxScore: 15 },
  { name: 'Testing', maxScore: 20 },
  { name: 'Architecture', maxScore: 15 },
];

export default function RubricScoring({ reviewId, onSave }: RubricScoringProps) {
  const [scores, setScores] = React.useState(
    defaultCategories.map((cat) => ({
      _id: '',
      reviewId,
      category: cat.name,
      score: 0,
      maxScore: cat.maxScore,
      feedback: '',
    }))
  );

  const handleScoreChange = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index].score = Math.min(score, newScores[index].maxScore);
    setScores(newScores);
  };

  const handleFeedbackChange = (index: number, feedback: string) => {
    const newScores = [...scores];
    newScores[index].feedback = feedback;
    setScores(newScores);
  };

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const maxScore = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Rubric Scoring</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">
            {totalScore} / {maxScore}
          </div>
          <div className="text-lg text-gray-600">Total Score: {percentage}%</div>
        </div>
      </div>

      <div className="space-y-6">
        {scores.map((score, idx) => (
          <div key={idx} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold">{score.category}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={score.maxScore}
                  value={score.score}
                  onChange={(e) => handleScoreChange(idx, parseInt(e.target.value) || 0)}
                  className="w-20 border rounded px-3 py-2 text-center"
                />
                <span className="text-gray-600">/ {score.maxScore}</span>
              </div>
            </div>
            <textarea
              value={score.feedback}
              onChange={(e) => handleFeedbackChange(idx, e.target.value)}
              placeholder="Add feedback for this category..."
              className="w-full border rounded px-3 py-2 text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>

      {onSave && (
        <button
          onClick={() => onSave(scores)}
          className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          Save Scores
        </button>
      )}
    </div>
  );
}
