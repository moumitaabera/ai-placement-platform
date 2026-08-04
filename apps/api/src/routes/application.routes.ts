import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { apply, myApplications, applicants,   updateStatus,} from "../controllers/application.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  apply
);
router.get(
  "/me",
  authenticate,
  myApplications
);
router.get(
  "/job/:jobId",
  authenticate,
  applicants
);
router.patch(
  "/:id/status",
  authenticate,
  updateStatus
);
export default router;