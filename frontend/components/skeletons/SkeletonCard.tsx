export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );
}
