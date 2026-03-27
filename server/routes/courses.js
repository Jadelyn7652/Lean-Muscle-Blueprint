const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const subscriptionMiddleware = require('../middleware/subscription');

const prisma = new PrismaClient();

// GET /api/courses
router.get('/', async (req, res) => {
  const { category } = req.query;
  const where = category ? { category } : {};
  const courses = await prisma.course.findMany({
    where,
    include: { _count: { select: { lessons: true } } },
    orderBy: { id: 'asc' },
  });
  res.json(courses);
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: Number(req.params.id) },
    include: { lessons: { orderBy: { order: 'asc' } } },
  });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', authMiddleware, subscriptionMiddleware, async (req, res) => {
  const courseId = Number(req.params.id);
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId: req.userId, courseId },
    });
    res.status(201).json(enrollment);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Already enrolled' });
    }
    throw e;
  }
});

module.exports = router;
