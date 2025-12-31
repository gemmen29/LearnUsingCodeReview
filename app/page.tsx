import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Code Review Learning Platform
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Master software development through real-world code reviews. Import GitHub repositories,
            analyze code, provide categorized feedback, and track your learning progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/api/auth/signin"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Import Repositories</h3>
              <p className="text-gray-600">
                Connect your GitHub account and import real repositories for review practice.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Review Code</h3>
              <p className="text-gray-600">
                Add inline comments categorized as bugs, performance, security, or readability
                issues.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed metrics and rubric-based scoring.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-left">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>GitHub repository integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Code diff viewer with inline comments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Categorized feedback system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Review checklists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Rubric-based scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mentor feedback and discussions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Progress tracking dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real-world code review workflows</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
