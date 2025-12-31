import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import CommentModel from '@/models/Comment';
import ProgressModel from '@/models/Progress';

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
    const comments = await CommentModel.find({ reviewId }).sort({ createdAt: 1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, filePath, lineNumber, category, content } = await request.json();

    if (!reviewId || !filePath || lineNumber === undefined || !category || !content) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const comment = await CommentModel.create({
      reviewId,
      userId: session.user.id,
      filePath,
      lineNumber,
      category,
      content,
    });

    // Update progress
    await ProgressModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        $inc: {
          commentsCreated: 1,
          [`categoryCounts.${category}`]: 1,
        },
        $set: { lastActivityAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
