export default function SkeletonStreak() {
  return (
    <div 
      className="bg-gradient-to-br from-orange-400 to-red-500 p-4 sm:p-6 rounded-lg shadow-lg"
      role="status"
      aria-label="Loading streak data"
    >
      <div className="text-center animate-pulse">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
        <div className="h-4 sm:h-5 bg-white/20 rounded w-32 mx-auto mb-3"></div>
        <div className="h-8 sm:h-10 bg-white/30 rounded w-20 mx-auto mb-2"></div>
        <div className="h-3 bg-white/20 rounded w-24 mx-auto mb-2"></div>
        <div className="h-3 bg-white/20 rounded w-20 mx-auto"></div>
      </div>
    </div>
  );
}
