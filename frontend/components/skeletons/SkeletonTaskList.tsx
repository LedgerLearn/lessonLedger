export default function SkeletonTaskList() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading tasks">
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-4 animate-pulse"></div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
        >
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
