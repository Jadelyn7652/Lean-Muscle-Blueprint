const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const subscriptionMiddleware = require('../middleware/subscription');

const prisma = new PrismaClient();

// GET /api/lessons/:id
router.get('/:id', authMiddleware, subscriptionMiddleware, async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: Number(req.params.id) },
    include: { course: true },
  });
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

// POST /api/lessons/:id/complete
router.post('/:id/complete', authMiddleware, subscriptionMiddleware, async (req, res) => {
  const lessonId = Number(req.params.id);
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  try {
    const progress = await prisma.progress.create({
      data: { userId: req.userId, lessonId },
    });
    res.status(201).json(progress);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Lesson already completed' });
    }
    throw e;
  }
});

module.exports = router;
