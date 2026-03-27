import { Link } from 'react-router-dom';

export default function SubscribeCancel() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
      <h1 className="text-2xl font-bold">No worries.</h1>
      <p className="text-gray-400 max-w-sm">
        You didn't complete checkout. Your account is still free — subscribe whenever you're ready.
      </p>
      <Link
        to="/pricing"
        className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        View Plans
      </Link>
    </main>
  );
}
