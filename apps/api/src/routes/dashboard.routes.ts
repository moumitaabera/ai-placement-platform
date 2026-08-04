import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { recruiterStats ,  studentStats,} from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/recruiter",
  authenticate,
  recruiterStats,
);
router.get(
  "/student",
  authenticate,
  studentStats
);
export default router;