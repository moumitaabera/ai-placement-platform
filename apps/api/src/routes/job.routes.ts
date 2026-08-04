import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  create,
  getJobs,
  getJob,
  update,
  remove,
} from "../controllers/job.controller";
const router = Router();
router.get("/", getJobs);

router.post(
  "/",
  authenticate,
  create
);

router.get(
  "/:id",
  getJob
);

export default router;

router.patch(
  "/:id",
  authenticate,
  update
);

router.delete(
  "/:id",
  authenticate,
  remove
);