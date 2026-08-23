import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { analyzeMyResume, getMyResumeAnalysis, } from "../controllers/resumeAnalysis.controller";

const router = Router();

router.post(
  "/analyze",
  authenticate,
  analyzeMyResume
);
router.get(
  "/:resumeId",
  authenticate,
  getMyResumeAnalysis
);

export default router;