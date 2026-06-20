import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.roadmap.deleteMany();

  // Frontend Development Roadmap
  const frontendRoadmap = await prisma.roadmap.create({
    data: {
      title: 'Frontend Development',
      description: 'Master modern frontend development with HTML, CSS, JavaScript, and React',
      category: 'Web Development',
      sections: {
        create: [
          {
            title: 'Foundations',
            order: 0,
            topics: {
              create: [
                {
                  title: 'HTML Basics',
                  order: 0,
                  subtopics: {
                    create: [
                      { title: 'HTML Structure', order: 0 },
                      { title: 'Semantic HTML', order: 1 },
                      { title: 'Forms & Input', order: 2 },
                    ],
                  },
                },
                {
                  title: 'CSS Styling',
                  order: 1,
                  subtopics: {
                    create: [
                      { title: 'Selectors & Properties', order: 0 },
                      { title: 'Flexbox', order: 1 },
                      { title: 'Grid', order: 2 },
                      { title: 'Responsive Design', order: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'JavaScript',
            order: 1,
            topics: {
              create: [
                {
                  title: 'Core Concepts',
                  order: 0,
                  subtopics: {
                    create: [
                      { title: 'Variables & Types', order: 0 },
                      { title: 'Functions', order: 1 },
                      { title: 'Objects & Arrays', order: 2 },
                    ],
                  },
                },
                {
                  title: 'Advanced Topics',
                  order: 1,
                  subtopics: {
                    create: [
                      { title: 'Async/Await', order: 0 },
                      { title: 'Promises', order: 1 },
                      { title: 'DOM Manipulation', order: 2 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'React',
            order: 2,
            topics: {
              create: [
                {
                  title: 'React Basics',
                  order: 0,
                  subtopics: {
                    create: [
                      { title: 'Components', order: 0 },
                      { title: 'JSX', order: 1 },
                      { title: 'Props & State', order: 2 },
                      { title: 'Hooks', order: 3 },
                    ],
                  },
                },
                {
                  title: 'Advanced React',
                  order: 1,
                  subtopics: {
                    create: [
                      { title: 'Context API', order: 0 },
                      { title: 'Custom Hooks', order: 1 },
                      { title: 'Performance Optimization', order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Backend Development Roadmap
  const backendRoadmap = await prisma.roadmap.create({
    data: {
      title: 'Backend Development',
      description: 'Learn server-side development with Node.js, Express, and databases',
      category: 'Web Development',
      sections: {
        create: [
          {
            title: 'Fundamentals',
            order: 0,
            topics: {
              create: [
                {
                  title: 'Node.js Basics',
                  order: 0,
                  subtopics: {
                    create: [
                      { title: 'Node.js Runtime', order: 0 },
                      { title: 'NPM & Packages', order: 1 },
                      { title: 'Modules & Exports', order: 2 },
                    ],
                  },
                },
                {
                  title: 'Express.js',
                  order: 1,
                  subtopics: {
                    create: [
                      { title: 'Routing', order: 0 },
                      { title: 'Middleware', order: 1 },
                      { title: 'Request/Response', order: 2 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Databases',
            order: 1,
            topics: {
              create: [
                {
                  title: 'SQL & PostgreSQL',
                  order: 0,
                  subtopics: {
                    create: [
                      { title: 'SQL Basics', order: 0 },
                      { title: 'Queries & Joins', order: 1 },
                      { title: 'Indexes & Performance', order: 2 },
                    ],
                  },
                },
                {
                  title: 'ORMs',
                  order: 1,
                  subtopics: {
                    create: [
                      { title: 'Prisma Basics', order: 0 },
                      { title: 'Migrations', order: 1 },
                      { title: 'Relations', order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Seed data created successfully');
  console.log(`Created ${frontendRoadmap.id} - Frontend Development`);
  console.log(`Created ${backendRoadmap.id} - Backend Development`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
