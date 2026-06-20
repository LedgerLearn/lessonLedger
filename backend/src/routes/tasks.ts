import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

// Get user tasks
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { dueDate: 'asc' },
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = await prisma.task.create({
      data: {
        userId: req.userId!,
        title,
        description,
        dueDate: new Date(dueDate),
        priority: priority || 'medium',
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, completed } = req.body;

    const task = await prisma.task.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data: { title, description, dueDate: dueDate ? new Date(dueDate) : undefined, priority, completed },
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await prisma.task.findUnique({ where: { id: req.params.id } });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.task.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
