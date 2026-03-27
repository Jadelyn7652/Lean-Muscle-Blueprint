import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Strength: 'bg-red-900 text-red-300',
  Hypertrophy: 'bg-purple-900 text-purple-300',
  Nutrition: 'bg-green-900 text-green-300',
  Cardio: 'bg-blue-900 text-blue-300',
  Mindset: 'bg-yellow-900 text-yellow-300',
};

export default function CourseCard({ course }) {
  const badgeClass = CATEGORY_COLORS[course.category] || 'bg-gray-700 text-gray-300';
  const lessonCount = course._count?.lessons ?? course.lessons?.length ?? 0;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-orange-500 transition flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white leading-snug">{course.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${badgeClass}`}>
          {course.category}
        </span>
      </div>
      <p className="text-sm text-gray-400 line-clamp-3">{course.description}</p>
      <p className="text-xs text-gray-500 mt-auto">{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</p>
    </Link>
  );
}
