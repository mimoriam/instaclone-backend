import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Run this file by:
// "scripts": {
//     "seed_users": "dotenv -e .env.local -- ts-node --compiler-options {\\\"module\\\":\\\"CommonJS\\\"} prisma/seed/users.seed.ts"
//   },
// npx prisma db seed

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();

    console.log('Seeding Users & Posts...');

    const password = await bcrypt.hash('123456', 12);

    const users = [
      {
        username: 'John Doe',
        fullName: 'John Doe',
        email: 'john@gmail.com',
        password,
      },
      {
        username: 'John Doe2',
        fullName: 'John Doe2',
        email: 'john2@gmail.com',
        password,
      },
      {
        username: 'John Doe3',
        fullName: 'John Doe3',
        email: 'john3@gmail.com',
        password,
      },
    ];

    await Promise.all(
      users.map((user) => {
        return prisma.user.create({
          data: {
            ...user,
            Post: {
              create: [
                {
                  caption: `Hello from ${user.username}`,
                  image: '',
                  thumbnail: '',
                  hashtags: [],
                },
                {
                  caption: `Hello2 from ${user.email}`,
                  image: '',
                  thumbnail: '',
                  hashtags: [],
                },
              ],
            },
          },
        });
      }),
    );
  } catch (err) {
    console.error(err);

    await prisma.$disconnect();
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
