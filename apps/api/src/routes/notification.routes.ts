import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  notifications,
  markAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  notifications
);

router.patch(
  "/:id/read",
  authenticate,
  markAsRead
);

export default router;