import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { analyzeMyResume } from "../controllers/resumeAnalysis.controller";

const router = Router();

router.post(
  "/analyze",
  authenticate,
  analyzeMyResume
);

export default router;