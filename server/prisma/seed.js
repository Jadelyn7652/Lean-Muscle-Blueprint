const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data to prevent duplicates on re-run
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();

  const courses = [
    {
      title: 'Lean Muscle Blueprint: Phase 1',
      description:
        'Build your foundation with 8 weeks of progressive resistance training. Master squat, deadlift, bench, row, and overhead press movements.',
      category: 'Strength',
      thumbnailUrl: null,
      lessons: [
        { title: 'Welcome & Program Overview', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Upper A — Push Day Walkthrough', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Lower A — Quad Day Walkthrough', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Upper B — Pull Day Walkthrough', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Lower B — Posterior Chain Walkthrough', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
        { title: 'Progressive Overload Explained', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 6 },
        { title: 'Deload Week — What to Expect', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 7 },
      ],
    },
    {
      title: 'Lean Muscle Blueprint: Phase 2',
      description:
        'Hypertrophy focus with increased volume and intensity. Push closer to failure, learn advanced techniques like mechanical drop sets and paused reps.',
      category: 'Hypertrophy',
      thumbnailUrl: null,
      lessons: [
        { title: 'Phase 2 Introduction — What Changes', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Upper A Phase 2 — Full Session', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Lower A Phase 2 — Pause Squats & Volume', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Upper B Phase 2 — Weighted Pull-Ups', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Lower B Phase 2 — Conventional Deadlift Day', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
        { title: 'Managing Fatigue at Higher Volumes', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 6 },
      ],
    },
    {
      title: 'Lean Muscle Blueprint: Phase 3',
      description:
        'Peak intensity training. Strength-hypertrophy hybrid with heavy compound work, rest-pause techniques, and final body transformation.',
      category: 'Strength',
      thumbnailUrl: null,
      lessons: [
        { title: 'Phase 3 Introduction — Intensification', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Heavy Bench — Working Up to Maximal Loads', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Heavy Squat Technique at Higher Weights', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Deadlift — Pulling Your Heaviest Weight', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Rest-Pause Sets — How and When to Use Them', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
        { title: 'Final Week — Finishing Strong', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 6 },
      ],
    },
    {
      title: 'Nutrition Masterclass',
      description:
        'Everything you need to know about calories, macros, meal timing, and practical meal prep for muscle building. Science-based and beginner-friendly.',
      category: 'Nutrition',
      thumbnailUrl: null,
      lessons: [
        { title: 'Understanding Calories and TDEE', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Protein — How Much and From Where', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Carbs and Fats — Fueling Your Training', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Meal Timing and Pre/Post-Workout Nutrition', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Practical Meal Prep — Sunday Setup', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
        { title: 'Adjusting Intake Based on Progress', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 6 },
      ],
    },
    {
      title: 'Cardio for Muscle Builders',
      description:
        'Learn how to use cardio to manage leanness without losing muscle. LISS, HIIT, and scheduling strategies for lifters.',
      category: 'Cardio',
      thumbnailUrl: null,
      lessons: [
        { title: 'Cardio and the Interference Effect', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'LISS — The Lifter\'s Best Cardio Friend', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'HIIT — When and How to Use It', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Scheduling Cardio Around Your Lifts', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
      ],
    },
    {
      title: 'Mindset & Motivation',
      description:
        'The mental framework behind sustainable body transformation. Identity, consistency, gym anxiety, setbacks, and the psychology of long-term success.',
      category: 'Mindset',
      thumbnailUrl: null,
      lessons: [
        { title: 'The Identity Shift — Who Are You Becoming?', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 1 },
        { title: 'Motivation Is Not What You Think', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 },
        { title: 'Overcoming Gym Anxiety', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 3 },
        { title: 'Navigating Setbacks Without Quitting', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 4 },
        { title: 'Building the Training Habit', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 5 },
      ],
    },
  ];

  for (const courseData of courses) {
    const { lessons, ...courseFields } = courseData;
    const course = await prisma.course.create({
      data: {
        ...courseFields,
        lessons: { create: lessons },
      },
    });
    console.log(`Created course: ${course.title}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
