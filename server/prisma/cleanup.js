const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete lessons belonging to duplicate courses (id 7-12)
  const deleted = await prisma.lesson.deleteMany({
    where: { courseId: { gt: 6 } },
  });
  console.log(`Deleted ${deleted.count} duplicate lessons`);

  const deletedCourses = await prisma.course.deleteMany({
    where: { id: { gt: 6 } },
  });
  console.log(`Deleted ${deletedCourses.count} duplicate courses`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
