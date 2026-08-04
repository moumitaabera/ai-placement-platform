import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { generateQuestions } from "../controllers/interview.controller";

const router = Router();

router.post(
  "/questions",
  authenticate,
  generateQuestions
);

export default router;