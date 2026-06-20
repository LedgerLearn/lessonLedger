import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Record<string, any>;
}

export class NFTService {
  /**
   * Award an achievement NFT to a user
   * In Phase 2, this will mint actual NFTs on Stellar
   */
  static async awardAchievementNFT(
    userId: string,
    type: 'milestone' | 'streak' | 'contributor',
    title: string,
    description: string,
    metadata: NFTMetadata
  ) {
    try {
      // Create achievement record
      const achievement = await prisma.achievement.create({
        data: {
          userId,
          type,
          title,
          description,
          nftId: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Placeholder ID
        },
      });

      // In Phase 2, mint actual NFT on Stellar
      // const nftId = await this.mintNFT(userId, metadata);
      // Update achievement with real NFT ID

      return achievement;
    } catch (error) {
      throw new Error(`Failed to award NFT: ${error}`);
    }
  }

  /**
   * Get user's NFTs
   */
  static async getUserNFTs(userId: string) {
    try {
      const achievements = await prisma.achievement.findMany({
        where: { userId, nftId: { not: null } },
        orderBy: { earnedAt: 'desc' },
      });

      return achievements;
    } catch (error) {
      throw new Error(`Failed to get NFTs: ${error}`);
    }
  }

  /**
   * Check if user qualifies for milestone NFT
   */
  static async checkMilestoneQualification(userId: string) {
    try {
      const completedTopics = await prisma.topic.findMany({
        where: { completed: true },
      });

      const milestones = [
        { count: 5, title: 'First Steps', description: 'Completed 5 topics' },
        { count: 10, title: 'Momentum', description: 'Completed 10 topics' },
        { count: 25, title: 'Expert', description: 'Completed 25 topics' },
        { count: 50, title: 'Master', description: 'Completed 50 topics' },
      ];

      for (const milestone of milestones) {
        if (completedTopics.length >= milestone.count) {
          const existing = await prisma.achievement.findFirst({
            where: {
              userId,
              title: milestone.title,
            },
          });

          if (!existing) {
            return milestone;
          }
        }
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to check milestone: ${error}`);
    }
  }

  /**
   * Check if user qualifies for streak NFT
   */
  static async checkStreakQualification(userId: string) {
    try {
      const streak = await prisma.streak.findUnique({
        where: { userId },
      });

      if (!streak) return null;

      const streakMilestones = [
        { days: 7, title: '7-Day Streak', description: 'Maintained a 7-day study streak' },
        { days: 30, title: '30-Day Streak', description: 'Maintained a 30-day study streak' },
        { days: 100, title: '100-Day Streak', description: 'Maintained a 100-day study streak' },
      ];

      for (const milestone of streakMilestones) {
        if (streak.currentCount >= milestone.days) {
          const existing = await prisma.achievement.findFirst({
            where: {
              userId,
              title: milestone.title,
            },
          });

          if (!existing) {
            return milestone;
          }
        }
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to check streak qualification: ${error}`);
    }
  }

  /**
   * Placeholder for actual NFT minting on Stellar (Phase 2)
   */
  private static async mintNFT(userId: string, metadata: NFTMetadata) {
    // In Phase 2, implement actual Stellar NFT minting
    // This would:
    // 1. Get user's wallet
    // 2. Create NFT contract
    // 3. Mint NFT with metadata
    // 4. Return NFT ID

    return `nft_${Date.now()}`;
  }
}
