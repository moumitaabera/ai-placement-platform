import { Router } from "express";

import {
  apply,
  myApplications,
  applicants,
  updateStatus,
} from "../controllers/application.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  applySchema,
  updateApplicationStatusSchema,
  jobIdParamsSchema,
  applicationIdParamsSchema,
} from "../validators/application.validator";

const router = Router();

// Student applies for a job
router.post(
  "/",
  authenticate,
  authorize("STUDENT"),
  validate(applySchema),
  apply
);

// Student views own applications
router.get(
  "/me",
  authenticate,
  authorize("STUDENT"),
  myApplications
);

// Recruiter views applicants for own job
router.get(
  "/job/:jobId",
  authenticate,
  authorize("RECRUITER"),
  validate(jobIdParamsSchema, "params"),
  applicants
);

// Recruiter updates application status
router.patch(
  "/:id/status",
  authenticate,
  authorize("RECRUITER"),
  validate(applicationIdParamsSchema, "params"),
  validate(updateApplicationStatusSchema),
  updateStatus
);

export default router;