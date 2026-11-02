import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

// Create Admin Role
const adminRole = await prisma.role.upsert({
  where: {
    role: "admin",
  },
  update: {},
  create: {
    role: "admin",
  },
});

// Create Editor Role
const editorRole = await prisma.role.upsert({
  where: {
    role: "editor",
  },
  update: {},
  create: {
    role: "editor",
  },
});

  // Hash Password
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  // Create Admin User
  await prisma.user.upsert({
    where: {
      email: "admin@portfolio.com",
    },
    update: {},
    create: {
      fullName: "Administrator",
      email: "admin@portfolio.com",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Database Seeded Successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });