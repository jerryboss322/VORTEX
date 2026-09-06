import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@tipshub.local";
  const hash = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin", passwordHash: hash, role: "ADMIN", isActive: true },
  });
  console.log("Admin:", admin.email, "/ Admin123!");

  const contribEmail = "contrib@tipshub.local";
  const chash = await bcrypt.hash("Contrib123!", 10);
  const contrib = await prisma.user.upsert({
    where: { email: contribEmail },
    update: {},
    create: { email: contribEmail, name: "Contributor", passwordHash: chash, role: "CONTRIBUTOR", isActive: true },
  });
  console.log("Contributor:", contrib.email, "/ Contrib123!");
}

main().finally(() => prisma.$disconnect());
