'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAchievementNotification } from '@/lib/useAchievementNotification';
import AchievementModal from './AchievementModal';
import { getStoredAuth } from '@/lib/auth';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  nftId?: string;
  earnedAt: string;
}

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
  isConnected: boolean;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { token } = getStoredAuth();
  
  const {
    currentAchievement,
    handleClose,
    handleShare,
    showAchievement,
    isConnected,
  } = useAchievementNotification(token);

  return (
    <AchievementContext.Provider value={{ showAchievement, isConnected }}>
      {children}
      <AchievementModal
        achievement={currentAchievement}
        onClose={handleClose}
        onShare={handleShare}
      />
    </AchievementContext.Provider>
  );
}

export function useAchievement() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievement must be used within AchievementProvider');
  }
  return context;
}
