import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import ProgressModel from '@/models/Progress';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    await dbConnect();

    let progress = await ProgressModel.findOne({ userId });

    if (!progress) {
      progress = await ProgressModel.create({
        userId,
        reviewsCompleted: 0,
        commentsCreated: 0,
        categoryCounts: { bug: 0, performance: 0, security: 0, readability: 0 },
        averageScore: 0,
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
