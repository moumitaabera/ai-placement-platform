import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { generateQuestions , 
  startInterviewController, 
  getInterviewSessionController,
  submitInterviewController, 
  getInterviewHistoryController,
  getInterviewResultController} from "../controllers/interview.controller";

const router = Router();

router.post(
  "/questions",
  authenticate,
  generateQuestions
);
router.post(
  "/start",
  authenticate,
  startInterviewController
);
router.get(
  "/session/:sessionId",
  authenticate,
  getInterviewSessionController
);
router.post(
  "/submit",
  authenticate,
  submitInterviewController
);
router.get(
  "/history",
  authenticate,
  getInterviewHistoryController
);
router.get(
 "/result/:sessionId",
 authenticate,
 getInterviewResultController
);
export default router;