import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress')
      .then((r) => setProgress(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-1">My Dashboard</h1>
      <p className="text-gray-400 mb-10">Welcome back, {user?.name}.</p>

      {loading ? (
        <p className="text-gray-500">Loading your progress...</p>
      ) : progress.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {progress.map((item) => (
            <Link
              key={item.courseId}
              to={`/courses/${item.courseId}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500 transition"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {item.completedLessons} / {item.totalLessons} lessons
                </span>
              </div>
              <ProgressBar percentage={item.percentage} />
              <p className="text-sm text-gray-500 mt-2">{item.percentage}% complete</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
