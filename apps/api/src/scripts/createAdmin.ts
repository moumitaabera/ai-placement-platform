import prisma from "../lib/prisma";
import { hashPassword } from "../utils/hash";

const createAdmin = async () => {
  const name = "Platform Admin";
  const email = "admin@aiplacement.com";
  const password = "Admin@12345";

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      console.log("Email:", email);
      return;
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin account created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();