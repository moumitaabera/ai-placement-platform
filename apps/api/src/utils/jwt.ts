import jwt from "jsonwebtoken";
import { env } from "../config/env";

type UserRole = "STUDENT" | "RECRUITER" | "ADMIN";

export const generateAccessToken = (
  id: string,
  role: UserRole
) => {
  return jwt.sign(
    {
      id,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign(
    { id },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};