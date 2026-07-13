export default function SkeletonAchievements() {
  return (
    <div role="status" aria-label="Loading achievements">
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40 mb-4 animate-pulse"></div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
          >
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
