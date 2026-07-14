'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  nftId?: string;
  earnedAt: string;
}

export const useAchievementNotification = (token: string | null) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [isShowing, setIsShowing] = useState(false);

  // WebSocket connection for real-time achievement notifications
  const { isConnected } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
    token,
    onMessage: (message) => {
      if (message.type === 'ACHIEVEMENT_EARNED' && message.data) {
        // Add to queue
        setAchievementQueue((prev) => [...prev, message.data]);
      }
    },
  });

  // Process queue
  useEffect(() => {
    if (achievementQueue.length > 0 && !isShowing) {
      const nextAchievement = achievementQueue[0];
      setCurrentAchievement(nextAchievement);
      setIsShowing(true);
      setAchievementQueue((prev) => prev.slice(1));
    }
  }, [achievementQueue, isShowing]);

  const handleClose = useCallback(() => {
    setIsShowing(false);
    setTimeout(() => {
      setCurrentAchievement(null);
    }, 300);
  }, []);

  const handleShare = useCallback((achievement: Achievement) => {
    // Web Share API
    if (navigator.share) {
      navigator.share({
        title: `Achievement Unlocked: ${achievement.title}`,
        text: achievement.description,
        url: window.location.origin + `/achievements`,
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      // Fallback: Copy to clipboard
      const shareText = `🏆 Achievement Unlocked: ${achievement.title}\n${achievement.description}\n\nCheck out my achievements at ${window.location.origin}/achievements`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Achievement details copied to clipboard!');
      });
    }
  }, []);

  // Manual trigger for testing or programmatic use
  const showAchievement = useCallback((achievement: Achievement) => {
    setAchievementQueue((prev) => [...prev, achievement]);
  }, []);

  return {
    currentAchievement,
    handleClose,
    handleShare,
    showAchievement,
    isConnected,
  };
};
