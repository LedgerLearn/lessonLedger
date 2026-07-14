'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Award, Trophy, Zap } from 'lucide-react';
import { SkeletonAchievements } from './skeletons';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  nftId?: string;
  earnedAt: string;
}

export default function AchievementsGrid() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data } = await api.getAchievements();
      if (data) {
        setAchievements(data as Achievement[]);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'streak':
        return <Zap className="w-8 h-8 text-orange-500" />;
      case 'contributor':
        return <Award className="w-8 h-8 text-purple-500" />;
      default:
        return <Award className="w-8 h-8 text-blue-500" />;
    }
  };

  if (loading) {
    return <SkeletonAchievements />;
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-sm sm:text-base text-gray-500">No achievements yet. Keep learning!</p>
      </div>
    );
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'from-yellow-400 to-yellow-600';
      case 'streak':
        return 'from-orange-400 to-red-500';
      case 'contributor':
        return 'from-purple-400 to-pink-500';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group overflow-hidden"
          style={{
            animation: `slide-up 0.5s ease-out ${index * 0.1}s backwards`
          }}
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
          
          {/* Glow effect for NFT badges */}
          {achievement.nftId && (
            <div className={`absolute -inset-1 bg-gradient-to-r ${getBadgeColor(achievement.type)} rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
          )}

          <div className="relative">
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 break-words">{achievement.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{achievement.description}</p>
              </div>
              <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                {getIcon(achievement.type)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 gap-2">
              <span className="text-xs text-gray-500 truncate">
                {new Date(achievement.earnedAt).toLocaleDateString()}
              </span>
              {achievement.nftId && (
                <span className={`text-xs bg-gradient-to-r ${getBadgeColor(achievement.type)} text-white px-2 py-1 rounded whitespace-nowrap font-medium shadow-sm`}>
                  NFT Minted
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
