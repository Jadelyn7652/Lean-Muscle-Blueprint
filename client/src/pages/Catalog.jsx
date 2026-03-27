import { useEffect, useState } from 'react';
import api from '../api/client';
import CourseCard from '../components/CourseCard';

const CATEGORIES = ['All', 'Strength', 'Hypertrophy', 'Nutrition', 'Cardio', 'Mindset'];

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = active !== 'All' ? `?category=${active}` : '';
    api.get(`/courses${params}`)
      .then((r) => setCourses(r.data))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
      <p className="text-gray-400 mb-8">Everything you need for a complete body transformation.</p>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              active === cat
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </main>
  );
}
