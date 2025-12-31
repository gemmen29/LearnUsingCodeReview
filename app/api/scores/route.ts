import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import RubricScoreModel from '@/models/RubricScore';
import ReviewModel from '@/models/Review';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    await dbConnect();
    const scores = await RubricScoreModel.find({ reviewId });

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, scores } = await request.json();

    if (!reviewId || !Array.isArray(scores)) {
      return NextResponse.json(
        { error: 'Review ID and scores array are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Delete existing scores for this review
    await RubricScoreModel.deleteMany({ reviewId });

    // Create new scores
    const createdScores = await RubricScoreModel.insertMany(
      scores.map((s: { category: string; score: number; maxScore: number; feedback?: string }) => ({ ...s, reviewId }))
    );

    // Calculate total score
    const totalScore = scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0);
    const maxScore = scores.reduce((sum: number, s: { maxScore: number }) => sum + s.maxScore, 0);
    const finalScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    // Update review with score
    await ReviewModel.findByIdAndUpdate(reviewId, {
      score: Math.round(finalScore),
      status: 'completed',
    });

    return NextResponse.json({ scores: createdScores, finalScore });
  } catch (error) {
    console.error('Error saving scores:', error);
    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 });
  }
}
