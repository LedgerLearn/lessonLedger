export default function SkeletonText({ 
  lines = 1, 
  className = "" 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '80%' : '100%' }}
          role="status"
          aria-label="Loading content"
        />
      ))}
    </div>
  );
}
