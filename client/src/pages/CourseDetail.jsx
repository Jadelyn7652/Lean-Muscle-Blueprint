import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user, hasSubscription } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`).then((r) => setCourse(r.data));
    if (user) {
      api.get('/progress').then((r) => {
        const found = r.data.find((p) => p.courseId === Number(id));
        if (found) setEnrolled(true);
      }).catch(() => {});
    }
  }, [id, user]);

  async function handleEnroll() {
    if (!user) { navigate('/register'); return; }
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
    } catch {
      // already enrolled or error
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  }

  if (!course) return <div className="p-12 text-gray-500">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/courses" className="text-sm text-gray-500 hover:text-gray-300 transition mb-6 inline-block">
        ← Back to catalog
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <span className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full">{course.category}</span>
      </div>

      <p className="text-gray-400 mb-8 leading-relaxed">{course.description}</p>

      {!hasSubscription ? (
        <div className="mb-8 bg-gray-900 border border-orange-900 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
          <p className="text-gray-300 text-sm">Subscribe to access all lessons in this course.</p>
          <Link to="/pricing" className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition text-sm">
            View Plans
          </Link>
        </div>
      ) : enrolled ? (
        <div className="inline-flex items-center gap-2 text-green-400 font-medium mb-8">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Enrolled
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-8 disabled:opacity-60"
        >
          {enrolling ? 'Enrolling...' : 'Enroll in Course'}
        </button>
      )}

      <h2 className="text-xl font-semibold mb-4">Lessons ({course.lessons.length})</h2>
      <div className="flex flex-col gap-2">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={hasSubscription && enrolled ? `/courses/${course.id}/lessons/${lesson.id}` : '/pricing'}
            className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg px-5 py-4 hover:border-orange-500 transition group"
          >
            <span className="text-gray-600 text-sm font-mono w-6 text-center">{lesson.order}</span>
            <span className="text-gray-200 group-hover:text-white transition">{lesson.title}</span>
            {!hasSubscription && (
              <svg className="ml-auto w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
