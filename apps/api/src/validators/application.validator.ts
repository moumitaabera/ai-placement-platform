import { z } from "zod";

export const applySchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  resumeId: z.string().uuid("Invalid resume ID"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "APPLIED",
    "REVIEWING",
    "SHORTLISTED",
    "INTERVIEW",
    "HIRED",
    "REJECTED",
  ]),
});

export const jobIdParamsSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

export const applicationIdParamsSchema = z.object({
  id: z.string().uuid("Invalid application ID"),
});