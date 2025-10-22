import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // create demo user
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@rivirtual.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@rivirtual.com",
      passwordHash,
    },
  });

  // create sample leads
  const lead1 = await prisma.lead.upsert({
    where: { mobile: "+919876543210" },
    update: {},
    create: {
      firstName: "Sri",
      lastName: "Demo",
      mobile: "+919876543210",
      status: "Lead",
      source: "Manual",
      ownerId: user.id,
    },
  });

  const lead2 = await prisma.lead.upsert({
    where: { mobile: "+911234567890" },
    update: {},
    create: {
      firstName: "Asha",
      lastName: "K",
      mobile: "+911234567890",
      status: "Prospect",
      source: "Website",
      ownerId: user.id,
    },
  });

  console.log("Seed Complete:", { user, lead1, lead2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
