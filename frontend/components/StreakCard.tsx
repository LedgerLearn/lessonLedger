'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/useWebSocket';
import { SkeletonStreak } from './skeletons';

interface Streak {
  id: string;
  currentCount: number;
  maxCount: number;
  lastActiveAt: string;
}

export default function StreakCard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStreakAtRisk, setIsStreakAtRisk] = useState(false);
  const [animate, setAnimate] = useState(false);

  // WebSocket connection for real-time updates
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

  const { isConnected } = useWebSocket({
    url: wsUrl,
    token,
    onMessage: (message) => {
      if (message.type === 'streak_update' && message.data) {
        setStreak(message.data as Streak);
        // Trigger animation on update
        setAnimate(true);
        setTimeout(() => setAnimate(false), 1000);
      }
    },
  });

  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await api.getStreak();
      if (data) {
        setStreak(data as Streak);
      }
      setLoading(false);
    };

    fetchStreak();
  }, []);

  // Check if streak is at risk (last active > 20 hours ago)
  useEffect(() => {
    if (!streak?.lastActiveAt) return;

    const checkStreakRisk = () => {
      const lastActive = new Date(streak.lastActiveAt);
      const now = new Date();
      const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
      
      // Warn if more than 20 hours since last activity
      setIsStreakAtRisk(hoursSinceActive > 20 && streak.currentCount > 0);
    };

    checkStreakRisk();
    const interval = setInterval(checkStreakRisk, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [streak]);

  if (loading) return <SkeletonStreak />;

  const currentStreak = streak?.currentCount || 0;
  const bestStreak = streak?.maxCount || 0;
  const hasActiveStreak = currentStreak > 0;

  return (
    <div className="relative bg-gradient-to-br from-orange-400 to-red-500 text-white p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden">
      {/* Real-time indicator */}
      {isConnected && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs opacity-75">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <span className="hidden sm:inline">Live</span>
        </div>
      )}

      {/* Warning banner for at-risk streak */}
      {isStreakAtRisk && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-xs sm:text-sm py-1 px-2 text-center font-semibold animate-pulse">
          ⚠️ Complete a task today to keep your streak!
        </div>
      )}

      <div className={`text-center ${isStreakAtRisk ? 'mt-6' : ''}`}>
        {/* Fire animation */}
        <div className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-3 transition-transform duration-300 ${
          animate ? 'scale-125' : 'scale-100'
        }`}>
          {hasActiveStreak ? (
            <span className={`inline-block ${hasActiveStreak ? 'animate-fire' : ''}`}>
              🔥
            </span>
          ) : (
            <span className="opacity-50">💤</span>
          )}
        </div>

        {/* Current Streak - Prominent Display */}
        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          {hasActiveStreak ? 'Current Streak' : 'No Active Streak'}
        </h3>
        <div className="mb-3">
          <p className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none">
            {currentStreak}
          </p>
          <p className="text-sm sm:text-base mt-1 opacity-90">
            {currentStreak === 1 ? 'day' : 'days'} in a row
          </p>
        </div>

        {/* Best Streak */}
        <div className="mt-4 pt-4 border-t border-white/30">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🏆</span>
            <div className="text-left">
              <p className="text-xs sm:text-sm opacity-75">Personal Best</p>
              <p className="text-2xl sm:text-3xl font-bold">{bestStreak}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {hasActiveStreak && (
          <p className="text-xs sm:text-sm mt-3 opacity-75">
            Keep it up! You&apos;re on fire! 🚀
          </p>
        )}
        {!hasActiveStreak && (
          <p className="text-xs sm:text-sm mt-3 opacity-75">
            Complete a task to start your streak
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fire {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(-5deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
          75% { transform: translateY(-7px) rotate(-3deg); }
        }
        
        .animate-fire {
          animation: fire 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
