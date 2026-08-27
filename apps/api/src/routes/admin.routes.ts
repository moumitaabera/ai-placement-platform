import { Router } from "express";

import {
  getStats,
  getUsers,
  deleteUser,
  getJobs,
  getApplications,
  getApplicationAnalytics,
} from "../controllers/admin.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
console.log("🔥 ADMIN ROUTER LOADED");

/*
 * Admin Statistics
 *
 * GET /api/admin/stats
 */
router.get(
  "/stats",
  authenticate,
  authorize("ADMIN"),
  getStats
);

/*
 * Admin Users
 *
 * GET /api/admin/users
 */
router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  getUsers
);

/*
 * Delete User
 *
 * DELETE /api/admin/users/:id
 */
router.delete(
  "/users/:id",
  authenticate,
  authorize("ADMIN"),
  deleteUser
);
router.get(
  "/jobs",
  authenticate,
  authorize("ADMIN"),
  getJobs
);
router.get(
  "/applications",
  authenticate,
  authorize("ADMIN"),
  getApplications
);
router.get(
  "/analytics/applications",
  authenticate,
  authorize("ADMIN"),
  getApplicationAnalytics
);

export default router;
