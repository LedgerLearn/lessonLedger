import SkeletonStreak from './SkeletonStreak';
import SkeletonChart from './SkeletonChart';
import SkeletonTaskList from './SkeletonTaskList';
import SkeletonAchievements from './SkeletonAchievements';

export default function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-72"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome */}
        <div className="mb-6 sm:mb-8 animate-pulse">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
        </div>

        {/* Streak Card */}
        <div className="mb-6 sm:mb-8">
          <SkeletonStreak />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <SkeletonChart />
          <SkeletonChart />
        </div>

        {/* Tasks and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="card">
            <SkeletonTaskList />
          </div>

          <div className="card">
            <SkeletonAchievements />
          </div>
        </div>
      </div>
    </div>
  );
}
