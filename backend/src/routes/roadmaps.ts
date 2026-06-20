import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all roadmaps
router.get('/', async (req: Request, res: Response) => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      include: { sections: { include: { topics: { include: { subtopics: true } } } } },
    });
    res.json(roadmaps);
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
