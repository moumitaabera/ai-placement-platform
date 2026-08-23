import { Router } from "express";
import {
  uploadResume,
  getResumes,
  removeResume,
  viewResume,
} from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/upload",
  authenticate,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/",
  authenticate,
  getResumes
);
router.get(
  "/:id/view",
  authenticate,
  viewResume
);
router.delete(
  "/:id",
  authenticate,
  removeResume
);
export default router;

