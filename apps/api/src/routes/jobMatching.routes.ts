import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { matchJob } from "../controllers/jobMatching.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  matchJob
);

export default router;