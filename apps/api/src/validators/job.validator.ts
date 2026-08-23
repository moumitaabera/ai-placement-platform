import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  description: z.string().min(10, "Description is too short"),
  location: z.string().optional(),
  salary: z.string().optional(),
  employmentType: z.string().min(1, "Employment type is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  deadline: z
    .string()
    .datetime()
    .optional(),
});

export const updateJobSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  employmentType: z.string().min(1).optional(),
  experienceLevel: z.string().min(1).optional(),
  skills: z.array(z.string()).min(1).optional(),
  deadline: z
    .string()
    .datetime()
    .optional(),
});

export const jobIdParamsSchema = z.object({
  id: z.string().uuid("Invalid job ID"),
});