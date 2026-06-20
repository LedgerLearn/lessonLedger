import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

// Get user achievements
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: req.userId },
      orderBy: { earnedAt: 'desc' },
    });
    res.json(achievements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Award achievement
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, description, nftId } = req.body;

    const achievement = await prisma.achievement.create({
      data: {
        userId: req.userId!,
        type,
        title,
        description,
        nftId,
      },
    });

    res.status(201).json(achievement);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get achievement by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const achievement = await prisma.achievement.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
