// prisma/seed.js
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding users...");

  // ----- USERS -----
  const admin = await prisma.user.upsert({
    where: { email: "admin@rivirtual.com" },
    update: {},
    create: {
      name: "RiVirtual Admin",
      email: "admin@rivirtual.com",
      role: Role.Admin,
      phone: "9000000001",
      passwordHash: "$2a$10$7pPhnYTrOQdZxzYkFQqHheW0bRJGqE7wqH8SP3D.3VRcR3ZfA02Bq", // password: admin123
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@rivirtual.com" },
    update: {},
    create: {
      name: "Demo Manager",
      email: "manager@rivirtual.com",
      role: Role.Manager,
      phone: "9000000002",
      passwordHash: "$2a$10$7pPhnYTrOQdZxzYkFQqHheW0bRJGqE7wqH8SP3D.3VRcR3ZfA02Bq", // password: admin123
    },
  });

  const a1 = await prisma.user.upsert({
    where: { email: "associate1@rivirtual.com" },
    update: {},
    create: {
      name: "Associate One",
      email: "associate1@rivirtual.com",
      role: Role.Associate,
      phone: "9000000003",
      managerId: manager.id,
      passwordHash: "$2a$10$7pPhnYTrOQdZxzYkFQqHheW0bRJGqE7wqH8SP3D.3VRcR3ZfA02Bq", // password: admin123
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
      passwordHash: "$2a$10$7pPhnYTrOQdZxzYkFQqHheW0bRJGqE7wqH8SP3D.3VRcR3ZfA02Bq", // password: admin123
    },
  });

  console.log("✅ Users seeded successfully!");

  // ----- LEADS -----
  console.log("🌱 Seeding leads...");

  const leadsData = [
    {
      salutation: "Mr",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      countryCode: "+91",
      mobile: "9999999999",
      whatsapp: "9999999999",
      country: "India",
      state: "Telangana",
      city: "Hyderabad",
      leadType: "Buyer",
      preferredLanguage: "English",
      companyName: "Acme Properties",
      leadStage: "Lead",
      assignedToId: a1.id,
    },
    {
      salutation: "Ms",
      firstName: "Priya",
      lastName: "Rao",
      email: "priya.rao@example.com",
      countryCode: "+91",
      mobile: "8888888888",
      whatsapp: "8888888888",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      leadType: "Seller",
      preferredLanguage: "Hindi",
      companyName: "Prime Estates",
      leadStage: "Prospect",
      assignedToId: a2.id,
    },
    {
      salutation: "Mr",
      firstName: "Ramesh",
      lastName: "Patel",
      email: "ramesh.patel@example.com",
      countryCode: "+91",
      mobile: "7777777777",
      whatsapp: "7777777777",
      country: "India",
      state: "Gujarat",
      city: "Ahmedabad",
      leadType: "Owner",
      preferredLanguage: "Gujarati",
      companyName: "RP Realty",
      leadStage: "Customer",
      assignedToId: manager.id,
    },
  ];

  for (const lead of leadsData) {
    await prisma.lead.create({ data: lead });
  }

  console.log("✅ Leads seeded successfully!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
