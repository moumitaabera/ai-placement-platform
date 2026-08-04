import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  
  JWT_SECRET: z.string().min(10),

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