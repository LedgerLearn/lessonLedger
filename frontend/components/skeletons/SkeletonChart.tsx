export default function SkeletonChart() {
  return (
    <div className="card" role="status" aria-label="Loading chart data">
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-4"></div>
        <div className="h-[250px] bg-gray-100 dark:bg-gray-800/50 rounded flex items-end justify-around gap-2 p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-t w-full"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
