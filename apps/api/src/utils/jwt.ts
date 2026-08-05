import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (id: string) => {
  return jwt.sign(
    { id },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "1d",
    }
  );
};