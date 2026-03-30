import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/courses').then((r) => { if (Array.isArray(r.data)) setFeatured(r.data.slice(0, 3)); }).catch(() => {});
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Build Lean Muscle.<br />
          <span className="text-orange-500">Transform Your Body.</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          A complete 24-week evidence-based program — training, nutrition, cardio, supplements, and mindset.
          Everything you need to change how you look and how you feel.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/courses"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition text-lg"
          >
            Browse Courses
          </Link>
          <Link
            to="/register"
            className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      {featured.length > 0 && (
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <div className="text-center mt-8">
            <Link to="/courses" className="text-orange-400 hover:text-orange-300 transition font-medium">
              View all courses →
            </Link>
          </div>
        </section>
      )}

      {/* Why section */}
      <section className="bg-gray-900 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">Everything You Need. Nothing You Don't.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: '🏋️', title: '24-Week Program', desc: 'Three progressive phases from foundation to peak intensity.' },
              { icon: '🥗', title: 'Nutrition Guide', desc: 'Calories, macros, and meal plans built for muscle growth.' },
              { icon: '🧠', title: 'Mindset Framework', desc: 'The psychology of consistency, habit, and identity change.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
