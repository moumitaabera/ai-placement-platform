import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { evaluateInterviewAnswer } from "../controllers/mockInterview.controller";

const router = Router();

router.post(
  "/evaluate",
  authenticate,
  evaluateInterviewAnswer
);

export default router;