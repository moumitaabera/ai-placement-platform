import prisma from "../lib/prisma";
import { hashPassword } from "../utils/hash";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

import crypto from "crypto";
import { sendEmail } from "../utils/email";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "STUDENT" | "RECRUITER"
) => {

   console.log("🟣 REGISTER EMAIL:", JSON.stringify(email));
  console.log("🟣 REGISTER EMAIL LENGTH:", email.length);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  console.log("🟣 REGISTER USER FOUND:", !!existingUser);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,

      studentProfile:
        role === "STUDENT"
          ? {
              create: {},
            }
          : undefined,

      recruiterProfile:
        role === "RECRUITER"
          ? {
              create: {},
            }
          : undefined,
    },
  });

  const { password: _, ...safeUser } = user;

  return safeUser;
};


export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
//   console.log("LOGIN USER:");
// console.log({
//   id: user?.id,
//   email: user?.email,
//   role: user?.role,
// });

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(
    password,
    user.password
  );

  if (!match) {
    throw new Error("Wrong password");
  }

  const accessToken = generateAccessToken(user.id, user.role);

const refreshToken = generateRefreshToken(user.id);

await prisma.refreshToken.create({
  data: {
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  },
});

const { password: _, ...safeUser } = user;

return {
  user: safeUser,
  accessToken,
  refreshToken,
};
};

export const refreshAccessToken = async (
  refreshToken: string
) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  ) as { id: string };

  const user = await prisma.user.findUnique({
  where: {
    id: payload.id,
  },
  select: {
    role: true,
  },
});

if (!user) {
  throw new Error("User not found");
}

const accessToken = generateAccessToken(
  payload.id,
  user.role
);

  return accessToken;
};

export const logoutUser = async (
  refreshToken: string
) => {
  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });

  return {
    message: "Logged out successfully",
  };
};

// ==========================================
// Forgot Password
// ==========================================

export const forgotPassword = async (
  email: string
) => {
  console.log("🔵 Forgot password started:", email);
   console.log("🔵 FORGOT EMAIL:", JSON.stringify(email));
  console.log("🔵 FORGOT EMAIL LENGTH:", email.length);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log("🟢 FORGOT USER FOUND:", !!user);

  /*
   * Don't reveal whether an email exists.
   * This prevents account enumeration.
   */
  if (!user) {
    console.log("🟡 No user found");
    return;
  }

  // Delete any previous reset tokens
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  });
   console.log("🟢 Old reset tokens deleted");

  // Generate secure random token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Store only the hash in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Token expires in 15 minutes
  const expiresAt = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await prisma.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt,
    },
  });

  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:3000";

  const resetUrl =
    `${frontendUrl}/reset-password/${rawToken}`;

    console.log("🟢 Reset URL created:", resetUrl);

  console.log("📧 Sending reset email...");


  await sendEmail(
    user.email,
    "Reset Your Password - AI Placement Platform",
    `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>

        <p>Hello ${user.name},</p>

        <p>
          We received a request to reset your password
          for your AI Placement Platform account.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              background: #000;
              color: #fff;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          AI Placement Platform
        </p>
      </div>
    `
  );
   console.log("🟢 Reset email sent successfully");
};


// ==========================================
// Reset Password
// ==========================================

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const resetToken =
    await prisma.passwordResetToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

  if (!resetToken) {
    throw new Error(
      "Invalid or expired password reset link"
    );
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    throw new Error(
      "Password reset link has expired"
    );
  }

  const hashedPassword =
    await hashPassword(newPassword);

  await prisma.user.update({
    where: {
      id: resetToken.userId,
    },
    data: {
      password: hashedPassword,
      provider: "LOCAL",
    },
  });

  // Token can only be used once
  await prisma.passwordResetToken.delete({
    where: {
      id: resetToken.id,
    },
  });
};