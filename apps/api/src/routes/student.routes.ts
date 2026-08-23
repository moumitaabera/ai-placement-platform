import { Router } from "express";
import { updateProfile , getProfile } from "../controllers/student.controller";
import { authenticate, } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.put(
  "/profile",
  authenticate,
  authorize("STUDENT"),
  updateProfile
);

router.get(
  "/profile",
  authenticate,
  authorize("STUDENT"),
  getProfile
);

export default router;