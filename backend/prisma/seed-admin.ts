import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const name = process.env.ADMIN_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !name || !password) {
    throw new Error('ADMIN_USERNAME, ADMIN_NAME, and ADMIN_PASSWORD must be set.');
  }

  if (password.length < 16) {
    throw new Error('ADMIN_PASSWORD must be at least 16 characters long.');
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new Error(`User "${username}" already exists; no account was changed.`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
      role: 'ADMIN',
      mustChangePassword: true,
      isActive: true
    }
  });

  console.log(`Admin account "${admin.username}" was created.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
