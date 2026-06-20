import { PrismaClient } from '@prisma/client';
import { Keypair } from 'stellar-sdk';

const prisma = new PrismaClient();

export class WalletService {
  /**
   * Create a new Stellar wallet for a user
   * In production, this would use proper key management
   */
  static async createWallet(userId: string) {
    try {
      // Check if wallet already exists
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (existingWallet) {
        return existingWallet;
      }

      // Generate new keypair (in production, use secure key management)
      const keypair = Keypair.random();

      const wallet = await prisma.wallet.create({
        data: {
          userId,
          address: keypair.publicKey(),
          publicKey: keypair.publicKey(),
        },
      });

      return wallet;
    } catch (error) {
      throw new Error(`Failed to create wallet: ${error}`);
    }
  }

  /**
   * Get user's wallet
   */
  static async getWallet(userId: string) {
    try {
      let wallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await this.createWallet(userId);
      }

      return wallet;
    } catch (error) {
      throw new Error(`Failed to get wallet: ${error}`);
    }
  }

  /**
   * Get wallet balance (placeholder for Phase 2)
   */
  static async getBalance(userId: string) {
    try {
      const wallet = await this.getWallet(userId);
      // In Phase 2, this will query the Stellar network
      return {
        address: wallet.address,
        balance: 0, // Placeholder
      };
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }
}
