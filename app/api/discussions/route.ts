import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import DiscussionModel from '@/models/Discussion';

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
    const discussions = await DiscussionModel.find({ reviewId }).sort({ createdAt: 1 });

    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, commentId, content, parentId } = await request.json();

    if (!reviewId || !content) {
      return NextResponse.json(
        { error: 'Review ID and content are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const discussion = await DiscussionModel.create({
      reviewId,
      commentId,
      userId: session.user.id,
      content,
      parentId,
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}
