import { Link } from 'react-router-dom';

export default function SubscribeSuccess() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
      <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">You're in.</h1>
        <p className="text-gray-400">Your subscription is active. Full access to all courses unlocked.</p>
      </div>
      <Link
        to="/courses"
        className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        Start Learning
      </Link>
    </main>
  );
}
