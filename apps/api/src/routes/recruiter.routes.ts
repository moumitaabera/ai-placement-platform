import { Router } from "express";

import {
  getRecruiterProfile,
  updateRecruiterProfile,
} from "../controllers/recruiter.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/profile",
  authenticate,
  authorize("RECRUITER"),
  getRecruiterProfile
);

router.put(
  "/profile",
  authenticate,
  authorize("RECRUITER"),
  updateRecruiterProfile
);

export default router;