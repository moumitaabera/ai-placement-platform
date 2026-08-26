import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

const email = "admin@aiplacement.com";
const newPassword = "Admin@12345";

const resetAdmin = async () => {
  try {
    const admin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      console.log("❌ Admin account not found.");
      return;
    }

    if (admin.role !== "ADMIN") {
      console.log("❌ This user is not an ADMIN.");
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    console.log("✅ Admin password reset successfully.");
    console.log(`Email: ${email}`);
    console.log(`New password: ${newPassword}`);
  } catch (error) {
    console.error("❌ Failed to reset admin password:", error);
  } finally {
    await prisma.$disconnect();
  }
};

resetAdmin();