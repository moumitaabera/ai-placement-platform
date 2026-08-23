import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string(),
  
  JWT_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  GEMINI_API_KEY: z.string(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  PORT: z
    .string()
    .optional()
    .default("5000"),
});

export const env = envSchema.parse(process.env);