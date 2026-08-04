import { Router } from "express";
import { updateProfile , getProfile } from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.put(
  "/profile",
  authenticate,
  updateProfile
);

router.get(
  "/profile",
  authenticate,
  getProfile
);

export default router;