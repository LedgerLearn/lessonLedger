import express, { Request, Response } from 'express';
import { NFTService } from '../services/nft.service';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// Get user's NFTs
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const nfts = await NFTService.getUserNFTs(req.userId!);
    res.json(nfts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check milestone qualification
router.get('/check/milestone', async (req: AuthRequest, res: Response) => {
  try {
    const milestone = await NFTService.checkMilestoneQualification(req.userId!);
    res.json({ qualified: !!milestone, milestone });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check streak qualification
router.get('/check/streak', async (req: AuthRequest, res: Response) => {
  try {
    const streak = await NFTService.checkStreakQualification(req.userId!);
    res.json({ qualified: !!streak, streak });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Award achievement NFT
router.post('/award', async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, description, metadata } = req.body;

    const achievement = await NFTService.awardAchievementNFT(
      req.userId!,
      type,
      title,
      description,
      metadata
    );

    res.status(201).json(achievement);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
