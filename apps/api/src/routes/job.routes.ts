import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  create,
  getJobs,
  getJob,
  update,
  remove,
  myJobs,
} from "../controllers/job.controller";

import {
  createJobSchema,
  updateJobSchema,
  jobIdParamsSchema,
} from "../validators/job.validator";

const router = Router();

// Public: View all jobs
router.get("/", getJobs);

// Recruiter: Create job
router.post(
  "/",
  authenticate,
  authorize("RECRUITER"),
  validate(createJobSchema),
  create
);

// Recruiter: View own jobs
router.get(
  "/my-jobs",
  authenticate,
  authorize("RECRUITER"),
  myJobs
);

// Public: View single job
router.get("/:id", getJob);

// Recruiter: Update own job
router.patch(
  "/:id",
  authenticate,
  authorize("RECRUITER"),
  validate(jobIdParamsSchema, "params"),
  validate(updateJobSchema),
  update
);

// Recruiter: Delete own job
router.delete(
  "/:id",
  authenticate,
  authorize("RECRUITER"),
  validate(jobIdParamsSchema, "params"),
  remove
);

export default router;