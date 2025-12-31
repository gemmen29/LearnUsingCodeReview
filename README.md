# Code Review Learning Platform

A comprehensive web platform for learning software development through reviewing real, customer-submitted code. Built with Next.js, MongoDB, and modern web technologies.

## Features

### 🔐 Authentication
- NextAuth.js integration with GitHub OAuth
- Credential-based authentication
- User roles (learner, mentor, admin)

### 📦 GitHub Integration
- Import repositories from GitHub
- View commit history
- Fetch and display code diffs

### 💬 Code Review System
- Inline code comments
- Categorized feedback (bugs, performance, security, readability)
- File-by-file diff viewer
- Line-by-line comment placement

### ✅ Review Features
- Interactive checklists
- Rubric-based scoring system
- Progress tracking dashboard
- Comment categorization
- Discussion threads (planned)
- Mentor feedback system (planned)

### 📊 Progress Tracking
- Review completion metrics
- Comment category analytics
- Average scoring
- Activity timeline

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **GitHub API**: @octokit/rest
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- GitHub account (for OAuth and API access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gemmen29/LearnUsingCodeReview.git
cd LearnUsingCodeReview
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: Create a GitHub OAuth App at https://github.com/settings/developers
- `GITHUB_TOKEN`: Personal access token from https://github.com/settings/tokens

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and generate a Client Secret
4. Add them to your `.env.local` file

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The application will be available at http://localhost:3000

## Usage

### For Learners

1. **Sign In**: Authenticate using GitHub or credentials
2. **Import Repository**: Add a GitHub repository to review
3. **Start Review**: Select a commit to review
4. **Add Comments**: Click on code lines to add categorized comments
5. **Complete Checklist**: Mark review checklist items
6. **Score Review**: Use the rubric scoring system
7. **Track Progress**: View your dashboard for metrics

### For Mentors (Coming Soon)

- Review learner submissions
- Provide detailed feedback
- Engage in discussions
- Track learner progress

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── repos/        # Repository management
│   │   ├── reviews/      # Review operations
│   │   ├── comments/     # Comment system
│   │   ├── scores/       # Scoring system
│   │   ├── discussions/  # Discussion threads
│   │   └── progress/     # Progress tracking
│   ├── dashboard/        # Main dashboard
│   ├── repo/            # Repository view
│   ├── review/          # Review interface
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── CodeViewer.tsx
│   ├── ProgressDashboard.tsx
│   ├── ReviewChecklist.tsx
│   └── RubricScoring.tsx
├── lib/
│   └── mongodb.ts       # Database connection
├── models/              # Mongoose schemas
│   ├── User.ts
│   ├── Repository.ts
│   ├── Review.ts
│   ├── Comment.ts
│   └── ...
└── types/
    └── index.ts         # TypeScript types
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Repositories
- `GET /api/repos` - List repositories
- `POST /api/repos` - Import repository
- `GET /api/repos/[id]/commits` - Get commits

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `GET /api/repos/diff/[sha]` - Get commit diff

### Comments
- `GET /api/comments?reviewId=...` - Get comments
- `POST /api/comments` - Add comment

### Scoring
- `GET /api/scores?reviewId=...` - Get scores
- `POST /api/scores` - Save scores

### Progress
- `GET /api/progress` - Get user progress

## Database Schema

### Collections
- **users**: User accounts and profiles
- **repositories**: Imported GitHub repositories
- **reviews**: Code review sessions
- **comments**: Inline code comments
- **checklistitems**: Review checklist items
- **rubricscores**: Scoring data
- **discussions**: Discussion threads
- **progress**: User progress tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Roadmap

- [ ] Real-time collaboration
- [ ] Advanced discussion threads
- [ ] Mentor assignment system
- [ ] Automated code quality checks
- [ ] Learning paths and certifications
- [ ] Mobile app
- [ ] Code review templates
- [ ] Analytics dashboard for educators

## Support

For issues and questions, please open an issue on GitHub.
