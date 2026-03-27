export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div
        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
