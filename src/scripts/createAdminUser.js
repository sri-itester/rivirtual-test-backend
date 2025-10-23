import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@rivirtual.in";
  const password = "123456";
  const name = "Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "Admin",
    },
  });

  console.log("✅ Admin created:", user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
