import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@tipshub.local" },
    update: {},
    create: { email: "admin@tipshub.local", name: "Admin", passwordHash: "pin-1740", role: "ADMIN", isActive: true },
  });
  console.log("Admin:", admin.email, "PIN 1740");
}

main().finally(() => prisma.$disconnect());
