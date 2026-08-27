import prisma from "../lib/prisma";
import { hashPassword } from "../utils/hash";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "STUDENT" | "RECRUITER"
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

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