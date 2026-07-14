'use client';

import { useEffect, useState } from 'react';
import { Trophy, Zap, Award, X, Share2, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  nftId?: string;
  earnedAt: string;
}

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
  onShare?: (achievement: Achievement) => void;
}

export default function AchievementModal({ achievement, onClose, onShare }: AchievementModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (achievement) {
      // Trigger animation after mount
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [achievement]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500" />;
      case 'streak':
        return <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-orange-500" />;
      case 'contributor':
        return <Award className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500" />;
      default:
        return <Award className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" />;
    }
  };

  const getGradient = (type: string) => {
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

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const handleShare = () => {
    if (achievement && onShare) {
      onShare(achievement);
    }
  };

  const handleViewNFT = () => {
    if (achievement?.nftId) {
      // Open NFT in explorer or viewer
      window.open(`/nft/${achievement.nftId}`, '_blank');
    }
  };

  if (!mounted || !achievement) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-500 ${
          isVisible
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-75 opacity-0 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(achievement.type)} opacity-10 animate-pulse`} />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Confetti/Sparkle effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-br ${getGradient(achievement.type)} rounded-full animate-float`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Achievement Badge */}
          <div className="mb-6 relative">
            <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${getGradient(achievement.type)} shadow-xl animate-bounce-slow`}>
              {getIcon(achievement.type)}
            </div>
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(achievement.type)} rounded-full blur-2xl opacity-30 animate-pulse`} />
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 animate-slide-up">
            Achievement Unlocked!
          </h2>

          {/* Achievement Name */}
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {achievement.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {achievement.description}
          </p>

          {/* NFT Badge */}
          {achievement.nftId && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700">
                <Award className="w-5 h-5" />
                <span>NFT Minted on Blockchain</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {achievement.nftId && (
              <button
                onClick={handleViewNFT}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                View NFT
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
