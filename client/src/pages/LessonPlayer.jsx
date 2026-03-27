import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    api.get(`/lessons/${lessonId}`).then((r) => setLesson(r.data));
    api.get('/progress').then((r) => {
      const course = r.data.find((p) => p.courseId === Number(courseId));
      // We don't have per-lesson status from the summary endpoint, so check via progress
    }).catch(() => {});
  }, [lessonId, courseId]);

  async function markComplete() {
    setMarking(true);
    try {
      await api.post(`/lessons/${lessonId}/complete`);
      setCompleted(true);
    } catch {
      setCompleted(true); // already completed
    } finally {
      setMarking(false);
    }
  }

  if (!lesson) return <div className="p-12 text-gray-500">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        to={`/courses/${courseId}`}
        className="text-sm text-gray-500 hover:text-gray-300 transition mb-6 inline-block"
      >
        ← Back to course
      </Link>

      <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>

      {/* Video embed */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
        <iframe
          src={lesson.videoUrl}
          title={lesson.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-gray-500">
          Part of: <span className="text-gray-300">{lesson.course.title}</span>
        </p>

        {completed ? (
          <span className="flex items-center gap-2 text-green-400 font-medium text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Lesson complete
          </span>
        ) : (
          <button
            onClick={markComplete}
            disabled={marking}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60 text-sm"
          >
            {marking ? 'Saving...' : 'Mark as Complete'}
          </button>
        )}
      </div>
    </main>
  );
}
