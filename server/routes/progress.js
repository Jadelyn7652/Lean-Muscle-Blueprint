const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const subscriptionMiddleware = require('../middleware/subscription');

const prisma = new PrismaClient();

// GET /api/progress
// Returns enrolled courses with lesson count, completed count, and % progress
router.get('/', authMiddleware, subscriptionMiddleware, async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.userId },
    include: {
      course: {
        include: {
          lessons: { select: { id: true } },
        },
      },
    },
  });

  const completedRecords = await prisma.progress.findMany({
    where: { userId: req.userId },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedRecords.map((p) => p.lessonId));

  const summary = enrollments.map(({ course, enrolledAt }) => {
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter((l) => completedSet.has(l.id)).length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return {
      courseId: course.id,
      title: course.title,
      category: course.category,
      totalLessons,
      completedLessons,
      percentage,
      enrolledAt,
    };
  });

  res.json(summary);
});

module.exports = router;
