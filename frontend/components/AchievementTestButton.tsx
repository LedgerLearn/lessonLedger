'use client';

import { useAchievement } from './AchievementProvider';
import { Trophy, Zap, Award } from 'lucide-react';

export default function AchievementTestButton() {
  const { showAchievement } = useAchievement();

  const testAchievements = [
    {
      id: 'test-1',
      type: 'milestone',
      title: 'First Steps',
      description: 'Completed your first learning task!',
      nftId: 'nft-test-123',
      earnedAt: new Date().toISOString(),
    },
    {
      id: 'test-2',
      type: 'streak',
      title: '7 Day Streak',
      description: 'Maintained a 7-day learning streak! Keep it up!',
      nftId: 'nft-test-456',
      earnedAt: new Date().toISOString(),
    },
    {
      id: 'test-3',
      type: 'contributor',
      title: 'Knowledge Sharer',
      description: 'Created your first roadmap to help the community!',
      earnedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      <button
        onClick={() => showAchievement(testAchievements[0])}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors"
      >
        <Trophy className="w-4 h-4" />
        <span className="text-sm font-medium">Test Milestone</span>
      </button>
      <button
        onClick={() => showAchievement(testAchievements[1])}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
      >
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">Test Streak</span>
      </button>
      <button
        onClick={() => showAchievement(testAchievements[2])}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-colors"
      >
        <Award className="w-4 h-4" />
        <span className="text-sm font-medium">Test Contributor</span>
      </button>
    </div>
  );
}
