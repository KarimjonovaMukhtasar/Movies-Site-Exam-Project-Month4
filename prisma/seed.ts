import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

const prisma = new PrismaService

async function main() {
  console.log("START SEEDING...");

  const superadmin = await prisma.users.create({
    data: {
      username: "SuperAdmin",
      email: "teamchatgpt10@gmail.com",
      password_hash: await bcrypt.hash("12345", 10),
      avatar_url: "https://picsum.photos/200",
      role: "superadmin",
    },
  });

  const admin = await prisma.users.create({
    data: {
      username: "Admin",
      email: "karimjonovamukhtasar2003@gmail.com",
      password_hash: await bcrypt.hash("12345", 10),
      avatar_url: "https://picsum.photos/200",
      role: "admin",
    },
  });

  console.log(
    `CREATED SUPERADMIN (${superadmin.id}) AND ADMIN (${admin.id})`
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });