import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all roadmaps with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        skip,
        take: limit,
        include: { sections: { include: { topics: { include: { subtopics: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.roadmap.count(),
    ]);

    res.json({
      roadmaps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get roadmap by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: req.params.id },
      include: { sections: { include: { topics: { include: { subtopics: true } } } } },
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create roadmap (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, category, sections } = req.body;

    const roadmap = await prisma.roadmap.create({
      data: {
        title,
        description,
        category,
        sections: {
          create: sections.map((section: any, idx: number) => ({
            title: section.title,
            order: idx,
            topics: {
              create: section.topics.map((topic: any, topicIdx: number) => ({
                title: topic.title,
                order: topicIdx,
                subtopics: {
                  create: topic.subtopics?.map((subtopic: any, subIdx: number) => ({
                    title: subtopic.title,
                    order: subIdx,
                  })) || [],
                },
              })),
            },
          })),
        },
      },
      include: { sections: { include: { topics: { include: { subtopics: true } } } } },
    });

    res.status(201).json(roadmap);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
