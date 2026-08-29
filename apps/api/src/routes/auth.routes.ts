import { Router } from "express";
import {
  register,
  login,
  me,
  refresh,
  logout,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
// import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  generalLimiter,
  authLimiter,
} from "../middleware/rateLimit.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetPasswordTokenSchema,
} from "../validators/auth.validator";

const router = Router();

router.post(
  "/register", 
  authLimiter,
  validate(registerSchema),
  register
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController
);

router.post(
  "/reset-password/:token",
  authLimiter,
  validate(resetPasswordTokenSchema, "params"),
  validate(resetPasswordSchema, "body"),
  resetPasswordController
);

router.post(
  "/refresh",
  generalLimiter,
  validate(refreshTokenSchema),
  refresh
);

router.post(
  "/logout",
  generalLimiter,
  validate(logoutSchema),
  logout
);

// Protected Route
router.get("/me", generalLimiter,authenticate, me);

export default router;