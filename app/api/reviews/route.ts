import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import ReviewModel from '@/models/Review';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const repositoryId = searchParams.get('repositoryId');

    await dbConnect();

    const query = repositoryId ? { repositoryId } : {};
    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repositoryId, commitSha } = await request.json();

    if (!repositoryId || !commitSha) {
      return NextResponse.json(
        { error: 'Repository ID and commit SHA are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const review = await ReviewModel.create({
      repositoryId,
      reviewerId: session.user.id,
      commitSha,
      status: 'draft',
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
