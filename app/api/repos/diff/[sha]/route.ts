import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Octokit } from '@octokit/rest';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sha: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sha } = await params;
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data: commit } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: sha,
    });

    return NextResponse.json(commit);
  } catch (error) {
    console.error('Error fetching commit diff:', error);
    return NextResponse.json({ error: 'Failed to fetch commit diff' }, { status: 500 });
  }
}
