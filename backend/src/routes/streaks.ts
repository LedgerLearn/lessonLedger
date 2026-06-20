import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

// Get user streak
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    let streak = await prisma.streak.findUnique({
      where: { userId: req.userId },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: { userId: req.userId! },
      });
    }

    res.json(streak);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update streak (increment on daily activity)
router.post('/update', async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await prisma.streak.findUnique({
      where: { userId: req.userId },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: { userId: req.userId!, currentCount: 1, maxCount: 1 },
      });
      return res.json(streak);
    }

    const lastActive = new Date(streak.lastActiveAt);
    lastActive.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActive.getTime() === today.getTime()) {
      // Already updated today
      return res.json(streak);
    } else if (lastActive.getTime() === yesterday.getTime()) {
      // Continue streak
      const newCount = streak.currentCount + 1;
      streak = await prisma.streak.update({
        where: { userId: req.userId },
        data: {
          currentCount: newCount,
          maxCount: Math.max(streak.maxCount, newCount),
          lastActiveAt: new Date(),
        },
      });
    } else {
      // Streak broken, reset
      streak = await prisma.streak.update({
        where: { userId: req.userId },
        data: {
          currentCount: 1,
          lastActiveAt: new Date(),
        },
      });
    }

    res.json(streak);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
