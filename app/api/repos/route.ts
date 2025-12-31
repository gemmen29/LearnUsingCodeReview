import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import RepositoryModel from '@/models/Repository';
import { Octokit } from '@octokit/rest';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const repos = await RepositoryModel.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(repos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
    }

    await dbConnect();

    // Fetch repo info from GitHub
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Create repository record
    const repository = await RepositoryModel.create({
      name: repo,
      owner,
      githubUrl: repoData.html_url,
      importedBy: session.user.id,
      defaultBranch: repoData.default_branch,
    });

    return NextResponse.json(repository);
  } catch (error) {
    console.error('Error importing repository:', error);
    return NextResponse.json({ error: 'Failed to import repository' }, { status: 500 });
  }
}
