// prisma/seed.js
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@rivirtual.com" },
    update: {},
    create: {
      name: "RiVirtual Admin",
      email: "admin@rivirtual.com",
      role: Role.Admin,
      phone: "9000000001",
    },
  });

  // Manager
  const manager = await prisma.user.upsert({
    where: { email: "manager@rivirtual.com" },
    update: {},
    create: {
      name: "Demo Manager",
      email: "manager@rivirtual.com",
      role: Role.Manager,
      phone: "9000000002",
    },
  });

  // Associates (linked to manager)
  const a1 = await prisma.user.upsert({
    where: { email: "associate1@rivirtual.com" },
    update: {},
    create: {
      name: "Associate One",
      email: "associate1@rivirtual.com",
      role: Role.Associate,
      phone: "9000000003",
      managerId: manager.id,
    },
  });
  const a2 = await prisma.user.upsert({
    where: { email: "associate2@rivirtual.com" },
    update: {},
    create: {
      name: "Associate Two",
      email: "associate2@rivirtual.com",
      role: Role.Associate,
      phone: "9000000004",
      managerId: manager.id,
    },
  });

  console.log("Seed complete:", { admin, manager, a1, a2 });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
