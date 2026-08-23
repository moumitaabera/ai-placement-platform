import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "RECRUITER"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});